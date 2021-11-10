import React, {useState} from 'react'
import StudentRequestForm from './components/StudentRequestForm'
import StudentRequestsTable from './components/StudentRequestsTable'

function StudentPage() {
    const [created,setCreated] = useState(false);
    const updateTable = () => {
      setCreated(!created);
    }
    return (
        <div>
            <StudentRequestForm onCreate={updateTable} />
            <br />
            <StudentRequestsTable reloadTable={created} />
        </div>
    )
}

export default StudentPage
