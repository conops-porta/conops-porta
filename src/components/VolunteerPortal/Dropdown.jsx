import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';

// child of volunteer portal
// used for the filtering by names 
// and for filtering by department

const useStyles = makeStyles(theme => ({
    formControl: {
        minWidth: 140,
    },
    selectEmpty: {
        marginTop: theme.spacing(2),
    },
}));

// a reusable function component that takes in props to populate a dropdown menu
export default function SimpleSelect(props) {
    const classes = useStyles();
    const [value, setValue] = React.useState('');
    const inputLabel = React.useRef(null);
    const [labelWidth, setLabelWidth] = React.useState(0);
    React.useEffect(() => {
        setLabelWidth(inputLabel.current.offsetWidth);
    }, []);
    const handleChange = event => {
        setValue(event.target.value);
        props.storeDropdownInState(event.target.value);
    };

    return (
        <div className='filter-shift'>
            <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel ref={inputLabel} id="demo-simple-select-outlined-label">
                    {props.title}
                </InputLabel>
                <Select
                    labelId="demo-simple-select-outlined-label"
                    id="demo-simple-select-outlined"
                    value={value}
                    onChange={handleChange}
                    labelWidth={labelWidth}
                >
                    <MenuItem value="">
                        <em>All</em>
                    </MenuItem>
                    {props.options.map(option => {
                        if (props.idKeyName) {
                            return <MenuItem value={option}>{option[props.keyName]} ({option[props.idKeyName]})</MenuItem>
                        } else {
                            return <MenuItem value={option}>{option[props.keyName]}</MenuItem>
                        }
                    })}
                </Select>
            </FormControl>
        </div>
    );
}