import { HttpResponse, HttpRequest, Controller } from '../protocols'
import { sendResponse, fieldsValidator } from '../utils-presentation'
import { patientFields } from '../models-fields'
import { CreatePatient } from '../../domain'
import { ListPatients } from '../../domain/usecases/list-patients'

export class CreatePatientController implements Controller {
  constructor (private readonly createService: CreatePatient) {}

  async service (request: HttpRequest): Promise<HttpResponse> {
    try {
      const error = fieldsValidator(patientFields, request.body)
      if (error) return sendResponse(400, error)
      const newPatient = await this.createService.create(request.body)
      return newPatient ? sendResponse(201) : sendResponse(400)
    } catch (err) {
      return sendResponse(500, err.message)
    }
  }
}

export class ListPatientsController implements Controller {
  constructor (private readonly listService: ListPatients) {}

  async service (request: HttpRequest): Promise<HttpResponse> {
    try {
      const listPatients = await this.listService.list()
      if (listPatients.length < 0) return sendResponse(200, 'no registered patient')
      return sendResponse(200, listPatients)
    } catch (err) {
      return sendResponse(500, err.message)
    }
  }
}
