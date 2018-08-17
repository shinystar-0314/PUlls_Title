import _ from 'lodash/fp';
import { ajax } from 'rxjs/observable/dom/ajax';
import { createAction } from 'redux-actions';
import { get } from 'lodash';

import { usersUrls } from '../../../../config/server-urls.constants';
import { testConstants } from '../../../../config/for-test.constants';

import { fetchPatientAllergiesDetailRequest } from './fetch-patient-allergies-detail.duck';
import { hasTokenInResponse } from '../../../../utils/plugin-helpers.utils';

export const FETCH_PATIENT_ALLERGIES_REQUEST = 'FETCH_PATIENT_ALLERGIES_REQUEST';
export const FETCH_PATIENT_ALLERGIES_SYNOPSIS_REQUEST = 'FETCH_PATIENT_ALLERGIES_SYNOPSIS_REQUEST';
export const FETCH_PATIENT_ALLERGIES_SUCCESS = 'FETCH_PATIENT_ALLERGIES_SUCCESS';
export const FETCH_PATIENT_ALLERGIES_FAILURE = 'FETCH_PATIENT_ALLERGIES_FAILURE';
export const FETCH_PATIENT_ALLERGIES_UPDATE_REQUEST = 'FETCH_PATIENT_ALLERGIES_UPDATE_REQUEST';

export const fetchPatientAllergiesRequest = createAction(FETCH_PATIENT_ALLERGIES_REQUEST);
export const fetchPatientAllergiesSynopsisRequest = createAction(FETCH_PATIENT_ALLERGIES_SYNOPSIS_REQUEST);
export const fetchPatientAllergiesSuccess = createAction(FETCH_PATIENT_ALLERGIES_SUCCESS);
export const fetchPatientAllergiesFailure = createAction(FETCH_PATIENT_ALLERGIES_FAILURE);
export const fetchPatientAllergiesUpdateRequest = createAction(FETCH_PATIENT_ALLERGIES_UPDATE_REQUEST);

export const fetchPatientAllergiesEpic = (action$, store) =>
  action$.ofType(FETCH_PATIENT_ALLERGIES_REQUEST)
    .mergeMap(({ payload }) =>
      ajax.getJSON(`${usersUrls.PATIENTS_URL}/${payload.userId}/allergies`, {
        headers: { Cookie: store.getState().credentials.cookie },
      })
        .map((response) => {
          const token = hasTokenInResponse(response);
          return fetchPatientAllergiesSuccess({
            userId: payload.userId,
            allergies: response,
            token,
          })
        })
    );

export const fetchPatientAllergiesSynopsisEpic = (action$, store) =>
    action$.ofType(FETCH_PATIENT_ALLERGIES_SYNOPSIS_REQUEST)
        .mergeMap(({ payload }) =>
            ajax.getJSON(`http://dev.ripple.foundation:8000/api/patients/${payload.userId}/synopsis/allergies`, {
                Authorization: 'Bearer '+testConstants.token
            })
                .map(response => fetchPatientAllergiesSuccess({
                    userId: payload.userId,
                    allergies: get(response, 'synopsis', []),
                }))
        );

// export const fetchPatientAllergiesSynopsisEpic = (action$, store) =>
//   action$.ofType(FETCH_PATIENT_ALLERGIES_SYNOPSIS_REQUEST)
//     .mergeMap(({ payload }) =>
//       ajax.getJSON(`${usersUrls.PATIENTS_URL}/${payload.userId}/synopsis/allergies`, {})
//         .map(response => fetchPatientAllergiesSuccess({
//           userId: payload.userId,
//           allergies: get(response, 'synopsis', []),
//         }))
//     );

export const fetchPatientAllergiesUpdateEpic = (action$, store) =>
  action$.ofType(FETCH_PATIENT_ALLERGIES_UPDATE_REQUEST)
    .mergeMap(({ payload }) =>
      ajax.getJSON(`${usersUrls.PATIENTS_URL}/${payload.userId}/allergies`, {
        headers: { Cookie: store.getState().credentials.cookie },
      })
        .flatMap((response) => {
          const userId = payload.userId;
          const sourceId = payload.sourceId;
          return [
            fetchPatientAllergiesSuccess({ userId, allergies: response }),
            fetchPatientAllergiesDetailRequest({ userId, sourceId }),
          ]
        })
    );

export default function reducer(patientsAllergies = {}, action) {
  switch (action.type) {
    case FETCH_PATIENT_ALLERGIES_SUCCESS:
      return _.set(action.payload.userId, action.payload.allergies, patientsAllergies);
    default:
      return patientsAllergies;
  }
}
