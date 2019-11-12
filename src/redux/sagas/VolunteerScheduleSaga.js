import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

function* createNewSchedule(action) {  // 
    try {
        const config = {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
        };
        console.log(action.payload, config);

        yield axios.post('/api/volunteer/schedule', action.payload, config)
        yield put({ type: 'FETCH_VOLUNTEER_SCHEDULE' })
    } catch (error) {
        console.log('error in createNewSchedule', error);
    }
}

function* getSchedule() {
    try {
        const config = {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
        };
        const response = yield axios.get('/api/volunteer/schedule', config);
        yield put({ type: 'SET_VOLUNTEER_SCHEDULE', payload: response.data })
    } catch (error) {
        console.log('error in getSchedule', error);
    }
}

function* VolunteerScheduleSaga() {
    yield takeLatest('CREATE_VOLUNTEER_SCHEDULE', createNewSchedule)
    yield takeLatest('FETCH_VOLUNTEER_SCHEDULE', getSchedule)
}

export default VolunteerScheduleSaga;