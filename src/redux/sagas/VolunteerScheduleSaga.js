import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

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
    yield takeLatest('FETCH_VOLUNTEER_SCHEDULE', getSchedule)
}

export default VolunteerScheduleSaga;