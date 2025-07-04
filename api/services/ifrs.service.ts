import { apiGet, apiPost } from 'api/apiClient'
import { ApiError } from '../httpClient'
import { FileFromRun } from './files.service'

export interface IFRSCalcProcessInput {
  calc_process_id: string
  calc_start_date: string
  calc_end_date: string
  calc_freq: string
  lc_calc_activated: number
  lic_calc_activated: number
  calc_precision: number
  sensitivity_type: string
  uoa_id: string
}

export interface IFRSReportProcessInput {
  calc_process_id: string
  report_process_id: string
  reporting_opening_date: string
  reporting_closing_date: string
  prv_report_process_id: string
  prv_yield_curve: string
  crr_yield_curve: string
}

export interface IFRSGeneratorResponse {
  run_id: string
  input_structure_errors: string[]
  files: FileFromRun[]
}

export interface IFRSPreGeneratorInputsIdsResponse {
  run_id: string
  uoa_ids: string[]
  yield_curve_ids: string[]
}

export interface IFRSUnitOfAccountInput {
  uoa_id: string
  scenario_id: string
  uoa_initrecog_date: string
  uoa_expiry_date: string
  lkd_yield_curve: string
}

export async function postIfrsCalcProcessInput(
  userId: string,
  runId: string,
  userKey: string,
  inputs: IFRSCalcProcessInput[]
): Promise<boolean> {
  try {
    await apiPost<void>(
      `users/${userId}/runs/${runId}/ifrs/inputs/calc-process`,
      inputs,
      userKey
    )
    return true
  } catch (e) {
    if (e instanceof ApiError) return false
    throw e
  }
}

export async function postIfrsReportProcessInput(
  userId: string,
  runId: string,
  userKey: string,
  inputs: IFRSReportProcessInput[]
): Promise<boolean> {
  try {
    await apiPost<void>(
      `users/${userId}/runs/${runId}/ifrs/inputs/report-process`,
      inputs,
      userKey
    )
    return true
  } catch (e) {
    if (e instanceof ApiError) return false
    throw e
  }
}

export async function postIfrsGenerator(
  userId: string,
  runId: string,
  userKey: string
): Promise<IFRSGeneratorResponse | undefined> {
  try {
    const { content } = await apiPost<IFRSGeneratorResponse>(
      `users/${userId}/runs/${runId}/ifrs/generator`,
      {},
      userKey
    )
    return content
  } catch (e) {
    if (e instanceof ApiError) return undefined
    throw e
  }
}

export async function getPreGeneratorInputsIds(
  userId: string,
  runId: string,
  userKey: string
): Promise<IFRSPreGeneratorInputsIdsResponse | undefined> {
  try {
    const { content } = await apiGet<IFRSPreGeneratorInputsIdsResponse>(
      `users/${userId}/runs/${runId}/ifrs/inputs/pre-generator-inputs-ids`,
      userKey
    )
    return content
  } catch (e) {
    if (e instanceof ApiError) return undefined
    throw e
  }
}

export async function postUnitsOfAccount(
  userId: string,
  runId: string,
  userKey: string,
  inputs: IFRSUnitOfAccountInput[]
): Promise<boolean> {
  try {
    await apiPost<void>(
      `users/${userId}/runs/${runId}/ifrs/inputs/units-of-account`,
      inputs,
      userKey
    )
    return true
  } catch (e) {
    if (e instanceof ApiError) return false
    throw e
  }
}
