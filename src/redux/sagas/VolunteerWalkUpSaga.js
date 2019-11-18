import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

function* getWalkUpShifts(action) {  // 
    try {
        const config = {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
        };
        // console.log(action.payload, config);
        const response = yield axios.get(`/api/walkup/shifts/${action.payload.badgeNumber}`)
        yield put({ type: 'SET_WALKUP_SHIFTS', payload: response.data})
    } catch (error) {
        console.log('error in walkup shifts saga', error);
    }
}

function* getAttendeeBadges() {
    try {
        const config = {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
        };
        const response = yield axios.get('/api/walkup/badgenumbers')
        yield put({ type: 'SET_EXISTING_BADGES', payload: response.data })
    } catch (error) {
        console.log('error in getting existing badges: ', error);
    }
}

function* volunteerWalkUpSaga() {
    yield takeLatest('FETCH_WALKUP_SHIFTS', getWalkUpShifts)
    yield takeLatest('FETCH_EXISTING_BADGES', getAttendeeBadges)
}

export default volunteerWalkUpSaga;