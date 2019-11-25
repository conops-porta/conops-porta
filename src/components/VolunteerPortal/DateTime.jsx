import 'date-fns';
import React from 'react';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
} from '@material-ui/pickers';

export default function MaterialUIPickers(props) {
    // The first commit of Material-UI
    const [selectedDate, setSelectedDate] = React.useState(null);
    const [selectedTime, setSelectedTime] = React.useState(null);

    const handleDateChange = (date) => {
        setSelectedDate(date);
        props.storeShiftDateTimeInState(date, null);
    };
    const handleTimeChange = (time) => {
        setSelectedTime(time);
        props.storeShiftDateTimeInState(null, time);
    };

    return (
        <>
        <div className='filter-shift'>
                <MuiPickersUtilsProvider utils={DateFnsUtils}
                    variant="outlined">
                    <KeyboardDatePicker
                        disableToolbar
                        format="MM/dd/yyyy"
                        margin="normal"
                        id="date-picker-inline"
                        label="Date"
                        value={selectedDate}
                        onChange={handleDateChange}
                        KeyboardButtonProps={{
                            'aria-label': 'change date',
                        }}
                    />
            </MuiPickersUtilsProvider>
        </div>
        <div className='filter-shift'>
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                    <KeyboardTimePicker
                        margin="normal"
                        variant="outlined"
                        id="time-picker"
                        label="Time"
                        value={selectedTime}
                        onChange={handleTimeChange}
                        KeyboardButtonProps={{
                            'aria-label': 'change time',
                        }}
                    />
            </MuiPickersUtilsProvider>
        </div>
        </>
    );
}
