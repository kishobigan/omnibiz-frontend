'use client'
import * as React from 'react';
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCalendar } from '@fortawesome/free-solid-svg-icons';
import './datepicker.css'


interface DateConstructor  {
    startDate: Date | null;
}

export class DateSelector extends React.Component<{}, DateConstructor> {
    constructor(props :{}) {
        super(props);
        this.state = {
            startDate: null
        };
        this.handleChange = this.handleChange.bind(this);
    }

    private handleChange(date:Date |null) {
        console.log('date is here!', date);
        this.setState({
            startDate: date
        });
    }

    public render() {
        const {startDate} = this.state;
        return (
            <div className="date-selector-container">
                <DatePicker
                    id="datepicker"
                    dateFormat="dd/MM/yyyy"
                    selected={startDate}
                    onChange={this.handleChange}
                    customInput={
                        <div className="date-picker-input">
                            <input
                                className="form-control"
                                readOnly
                                placeholder="Pick a date"
                                value={startDate ? startDate.toLocaleDateString() : ''}
                            />
                            <FontAwesomeIcon icon={faCalendar} className="calendar-icon"/>
                        </div>
                    }
                />
            </div>

        )
    }
}