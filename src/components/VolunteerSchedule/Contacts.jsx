import React, { Component } from 'react';
import MaterialTable from 'material-table'

class Contacts extends Component {
    state = {};
   
    render() {
        return (
            <div className="Contacts">
                <MaterialTable
                    title="Editable Example"
                    columns={2}
                    options={{
                        columnsButton: true,
                        // headerStyle: { backgroundColor: 'blue', color: 'white' },
                        pageSize: 10,
                        pageSizeOptions: [10, 20, 50],
                        toolbarButtonAlignment: "right",
                        searchFieldAlignment: "left",
                        showTitle: false
                    }}
                    data={2}
                    actions={[
                        {
                            icon: "accessibility",
                            tooltip: "Find this person`s personal info",
                            onClick: {}
                        },
                        rowData => ({
                            icon: "group",
                            tooltip: "Find all members of this group",
                            onClick: {},
                            disabled: rowData.orderID == null
                        }),
                    ]}
                    editable={{}}
                />
            </div>
        );
    }
}

export default Contacts;
