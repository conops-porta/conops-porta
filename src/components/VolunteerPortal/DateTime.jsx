import 'date-fns';
import React from 'react';
import Grid from '@material-ui/core/Grid';
import DateFnsUtils from '@date-io/date-fns';
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker,
} from '@material-ui/pickers';

export default function MaterialUIPickers(props) {
    // The first commit of Material-UI
    const [selectedDate, setSelectedDate] = React.useState(new Date());

    const handleDateChange = date => {
        setSelectedDate(date);
        props.filterByShift(date);
        // console.log(date)
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
                        value={selectedDate}
                        onChange={handleDateChange}
                        KeyboardButtonProps={{
                            'aria-label': 'change time',
                        }}
                    />
            </MuiPickersUtilsProvider>
        </div>
        </>
    );
}
