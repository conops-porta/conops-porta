import React, { Component } from 'react';
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import Typography from '@material-ui/core/Typography';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import axios from 'axios'

class Manage extends Component {

    componentDidMount() {
        axios.get('/api/volunteer/shifts')
        .then(response => {
            console.log(response.data)
            this.setState({
                data: response.data
            })
        }).catch(error => {
            console.log(error)
        })
    }

    render() {
        return (
            <div className="Manage">
                <h1>MANAGE</h1>

                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>
                            </TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        <TableRow >
                            <ExpansionPanel>
                                <ExpansionPanelSummary
                                    expandIcon={<ExpandMoreIcon />}
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                >
                                    <Typography >Expansion Panel 1</Typography>
                                </ExpansionPanelSummary>
                                <ExpansionPanelDetails>
                                    <Typography>
                                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                                        sit amet blandit leo lobortis eget.
                                    </Typography>

                                    <TableCell>
                                    </TableCell>
                                </ExpansionPanelDetails>
                            </ExpansionPanel>
                        </TableRow>
                    </TableBody>
                </Table>



            </div >
        );
    }
}

export default Manage;
