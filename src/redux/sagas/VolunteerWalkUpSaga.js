import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

function* getWalkUpShifts(action) {  // 
    try {
        const config = {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
        };
        console.log(action.payload.badgeNumber, config);
        const response = yield axios.get(`/api/walkup/shifts/${action.payload.badgeNumber}`)
        yield put({ type: 'SET_WALKUP_SHIFTS', payload: response.data})
    } catch (error) {
        console.log('error in walkup shifts saga', error);
    }
}

function* volunteerWalkUpSaga() {
    yield takeLatest('FETCH_WALKUP_SHIFTS', getWalkUpShifts)
}

export default volunteerWalkUpSaga;