const getFloors = require('./getfloors.js');
const Moment = require('moment');
const MomentRange = require('moment-range');
const moment = MomentRange.extendMoment(Moment);

module.exports = (function(data, start, end, users, exclude) {
    var needRange = moment.range(moment(start).utc(), moment(end).utc())
    var date = moment(start).utc().format('YYYY-MM-DD');
    var needdEmptyEvents = [];
    var suitableRanges = [];
    var suitableBusyRanges = [];
    
    var floors = JSON.parse(JSON.stringify(data));

    for (var floor in floors) {
        var floorItem = floors[floor];
        floorItem.forEach(room => {
            var events = room.Events;
            var allEvents = [];

            /*
            Отбираю все эвенты по нужной дате
             */
            events.forEach(event => {
                if (moment(date).format('YYYY-MM-DD') == moment(event.dateStart).utc().format('YYYY-MM-DD')) {
                    allEvents.push(event);
                }
            })
            /*
            Похожусь по всем евентам, возвращаю массив свобоных интервалов и массив занятых евентов
             */

            var emptyRanges = [];
            var busyRanges = [];
            allEvents.forEach((event, i) => {
                var eventStart = moment(event.dateStart).utc(),
                    eventEnd = moment(event.dateEnd).utc();

                if (event.type && event.type === 'empty') {
                    emptyRanges.push(moment.range(eventStart, eventEnd));
                } else {
                    busyRanges.push(event);
                }
            })
            /*
            Прохожусь по массиву свободных евентов
             */

            emptyRanges.forEach(range => {

                /*
                если нужный интервал попадает в интервал свободного времени добавляю его в массив подходящих переговорок
                 */
                if (range.contains(needRange)) {
                    suitableRanges.push({
                        floor: floor,
                        roomTitle: room.title,
                        roomId: room.id,
                        capMin: room.capacityMin,
                        capMax: room.capacityMax,
                        timeStart: range.start,
                        timeEnd: range.end
                    });
                }

                /*
                если нужное время равно времени свободного эвента
                И
                нужный интервал попадает в интервал свободного времени добавляю его в массив возможно потребующихся свободных интервалов
                 */

                if (moment(range.start).isSame(moment(start).utc()) && range.contains(needRange)) {
                    needdEmptyEvents.push({
                        floor: floor,
                        roomTitle: room.title,
                        roomId: room.id,
                        capMin: room.capacityMin,
                        capMax: room.capacityMax,
                        timeStart: range.start,
                        timeEnd: range.end
                    })
                }
            })

            /*
            прохожусь по массиву занятых эвентов
             */

            busyRanges.forEach(event => {
                /*
                если время интервал евента равен нужному интервалу добавляю его в возможно понадобящийся массив занятых переговорок
                 */
                if (moment.range(event.dateStart, event.dateEnd).isSame(needRange)) {
                    suitableBusyRanges.push({
                        floor: floor,
                        roomTitle: room.title,
                        roomId: room.id,
                        eventId: event.id,
                        capMin: room.capacityMin,
                        capMax: room.capacityMax,
                        timeStart: event.dateStart,
                        timeEnd: event.dateEnd,
                        users: event.Users.length
                    });
                }
            })
        })
    }

    /*
    если пришел массив с пользователями
     */
    if (users && users.length > 0) {
        var usersSuitableRanges = [];
        var usersSuitableBusyRanges = [];

        /*
        прохожусь по массиву подходящих свободных интервалов
         */
        suitableRanges.forEach((item) => {
            /*
            если количество пользователей в новом эвенте подходит, добавляю этот интервал в массив подходящих интервало по времени и пользователям
             */
            if (users.length >= item.capMin && users.length <= item.capMax) {
                usersSuitableRanges.push(item);
            }
        })

        /*
        прохожусь по массиву подходящих занятых интервалов
         */
        suitableBusyRanges.forEach((item, i) => {
            /*
            если количество пользователей в подходящих занятых эвентах подходит, добавляю этот эвент в массив подходящих занятых интервалов по времени и пользователям
             */
            if (users.length >= item.capMin && users.length <= item.capMax) {
                usersSuitableBusyRanges.push(item);
            }
        })


        /*
        приравниваю подходящие массивы
         */
        suitableRanges = usersSuitableRanges;
        suitableBusyRanges = usersSuitableBusyRanges;


        /*
        считаю сумарное количество пройденых пользователями этажей до всех переговорок в массиве подходящих
         */
        suitableRanges.forEach(item => {
            var countFloor = 0;

            users.forEach(user => {
                countFloor = countFloor + Math.abs(item.floor - user.homeFloor)
            })

            item.countFloor = countFloor;
        })

        /*
        считаю сумарное количество пройденых пользователями этажей до всех переговорок в массиве занятых подходящих
         */
        suitableBusyRanges.forEach(item => {
            var countFloor = 0;

            users.forEach(user => {
                countFloor = countFloor + Math.abs(item.floor - user.homeFloor)
            })

            item.countFloor = countFloor;
        })

        /*
        Сортирую подходящие переговорки по кол-ву пройденных этажей
         */

        suitableRanges.sort((a, b) => {
            return a.countFloor - b.countFloor;
        })

        suitableBusyRanges.sort((a, b) => {
            return a.countFloor - b.countFloor;
        })

    }

    /*
    если в массиве подходящих переговорок пусто (Поиск переговорок которые можно перенести)
     */
    if (suitableRanges.length == 0) {
        let replaceEventMap = [];

        /*
        прохожусь по массиву подходящих свободных переговорок
         */
        needdEmptyEvents.forEach(itemAll => {
            /*
            прохожусь по массиву подходящих занятых переговорок
             */
            suitableBusyRanges.forEach(itemBusy => {
                /*
                если количетво пользователей в подходящей занятой переговорке подходит в свободную переговорку
                добавляю занятый эевент, свободное время в другой переговорке и массив соответсвия ID занятого эвента и свободной переговорки
                 */
                if (itemBusy.users >= itemAll.capMin && itemBusy.users <= itemAll.capMax) {
                    replaceEventMap.push({
                        empty: itemAll,
                        busy: itemBusy,
                        map: [itemAll.roomId, itemBusy.eventId]
                    });
                }
            })
        })

        return {type: 'replace', rooms: replaceEventMap};
    } else {
        return {type: 'empty', rooms: suitableRanges};
    }
})