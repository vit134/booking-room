import React, { Component } from 'react';

class Schedule extends Component {
    render() {
        const arr = [8,9,10,11,12,13,14,15,16,17,18,19,20,21,22,23];

        var data = Object.entries(this.props.data);

        console.log(data);

        return (
            <div className="main__schedule js-schedule">
                <div className="main__schedule__inner">
                    <div className="main__schedule__col-left js-col-left">
                        {
                            data.map(floor => {
                                return (
                                    <div className="main__floor" key={floor}>
                                        <div className="main__floor__title">{floor[0]} этаж</div>
                                        {
                                            floor[1].map(room => {
                                                return (
                                                    <div className="main__schedule__room js-main-events-room " data-room-id={ room.id } key={room.id}>
                                                        <div className="main__schedule__room__name">{ room.title }</div>
                                                        <div className="main__schedule__room__capacity">
                                                            {
                                                                room.capacityMin == 0 ? `до  ${room.capacityMax} человек` : `${ room.capacityMin }—${ room.capacityMax } человек`
                                                            }
                                                        </div>
                                                    </div>
                                                )
                                            })
                                        }
                                    </div>
                                )
                            })
                        }
                    </div>
                    <div className="main__schedule__col-right">
                        <div className="main__schedule__col-right__inner">
                            <div className="main__hours">
                                {
                                    arr.map(i => {
                                        return (
                                            i == 1
                                                ?  <div className="main__hours__item js-hours-item">{ i }:00</div>
                                                : <div className="main__hours__item js-hours-item" key={i}>{ i }</div>
                                        )
                                    })
                                }
                            </div>
                            <div className="main__lines">
                                <span className="main__lines__current js-hours-current">
                                    <span className="main__lines__current__label">15:12</span>
                                </span>
                                {
                                    arr.map(i => {
                                        return (
                                            <span className="main__lines__item" key={i}></span>
                                        )
                                    })
                                }
                            </div>
                            <div className="main__events">
                                {
                                    data.map(floor => {
                                        return (
                                            <div className="main__events__floor" key={floor[0]}>
                                                <div className="main__events__row main__events__row_empty">
                                                    <div className="main__events__floor__title js-events-floor">{ floor[0] } этаж</div>
                                                </div>
                                                {
                                                    floor[1].map(room => {
                                                        return (
                                                            <div className="main__events__row js-main-events-row" data-room-id={ room.id } key={room.id}>
                                                                <span className="main__events__room busy js-events-room">{ room.title }</span>
                                                                {
                                                                    room.Events.map(event => {
                                                                        var eventStyles = {
                                                                            width: event.width * 1.5625 + '%'
                                                                        }
                                                                        return (
                                                                            event.type && event.type == 'empty'
                                                                                ? <div className="main__events__item js-event-item js-add-event-btn" key={event.id} style={eventStyles}></div>
                                                                                : <div className="main__events__item js-event-item busy" key={event.id} style={eventStyles}></div>
                                                                        )
                                                                    })
                                                                }
                                                            </div>
                                                        )
                                                    })
                                                }
                                            </div>
                                        )
                                    })
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>

        );
    }
}

export default Schedule;


/*const todayPlansComponent = todayPlans.map((plan) => {
    return <Plan key={plan.id} {...plan}/>;
});*/
