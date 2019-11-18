import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

function* getContacts() {
    try {
        const config = {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
        };
        const response = yield axios.get('/api/volunteer-admin/contacts', config);
        yield put({ type: 'SET_VOLUNTEER_CONTACTS', payload: response.data })
    } catch (error) {
        console.log('error in getHours', error);
    }
}

function* VolunteerContactSaga() {
    yield takeLatest('FETCH_VOLUNTEER_CONTACTS', getContacts)
}

export default VolunteerContactSaga;