import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

function* getHours() {
    try {
        const config = {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
        };
        const response = yield axios.get('/api/volunteer-portal/hours', config);
        yield put({ type: 'SET_VOLUNTEER_HOURS', payload: response.data })
    } catch (error) {
        console.log('error in getHours', error);
    }
}

function* VolunteerHoursSaga() {
    yield takeLatest('FETCH_VOLUNTEER_HOURS', getHours)
}

export default VolunteerHoursSaga;