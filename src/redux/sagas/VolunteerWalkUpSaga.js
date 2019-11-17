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

function* postWalkUpInfo(action) {  // 
    try {
        const config = {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
        };
        console.log(action.payload.badgeNumber, config);
        yield axios.post('/api/walkup/info/', action.payload);
        yield put({type: 'SET_WALKUP_INFO', payload: action.payload.id})
    } catch (error) {
        console.log('error in walkup info saga', error);
    }
}

function* volunteerWalkUpSaga() {
    yield takeLatest('FETCH_WALKUP_SHIFTS', getWalkUpShifts)
    yield takeLatest('POST_WALKUP_INFO', postWalkUpInfo)
}

export default volunteerWalkUpSaga;