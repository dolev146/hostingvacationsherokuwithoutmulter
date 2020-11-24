import React from 'react'
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import FormLabel from '@material-ui/core/FormLabel';

export default function FilterVacations({ show, setshow }) {

    const handleChange = event => {
        setshow(event.target.value)
    }

    return (
        <div>
            <FormControl component="fieldset">
                <FormLabel component="legend">Filter Results</FormLabel>
                <RadioGroup row name="position" value={show} onChange={handleChange} defaultValue="All">
                    <FormControlLabel value="All" control={<Radio color="primary" />} label="All" />
                    <FormControlLabel value="Followed" control={<Radio color="primary" />} label="Followed" />
                </RadioGroup>
            </FormControl>
        </div>
    )
}
