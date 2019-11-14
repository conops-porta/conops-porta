import { put, takeLatest } from 'redux-saga/effects';
import axios from 'axios';

function* volunteerWalkUp(action) {  // 
    try {
        const config = {
            headers: { 'Content-Type': 'application/json' },
            withCredentials: true,
        };
        console.log(action.payload.badgeNumber, config);

        const response = yield axios.get(`/api/walkup/badgenumber/${action.payload.badgeNumber}`)
        yield put({ type: 'SET_WALKUP_BADGE_NUMBER', payload: response.data})
    } catch (error) {
        console.log('error in volunteer walkup saga', error);
    }
}

// function* volunteerBadgeNumber(action) {
//     try {
//         const response = yield axios.get('/api/walkup/badgenumber');
//         yield put({ type: 'SET_WALKUP_BADGE_NUMBER', payload: response.data });
//     } catch(error) {
//         console.log('error while getting data', error);
//     } // end try
// }

function* volunteerWalkUpSaga() {
    yield takeLatest('FETCH_WALKUP_BADGE_NUMBER', volunteerWalkUp)
    // yield takeLatest('FETCH_WALKUP_BADGE_NUMBER', volunteerBadgeNumber)
}

export default volunteerWalkUpSaga;