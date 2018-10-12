
/**
 * The response object of a webservice.
 */
export interface GondolinResponse {
  success: boolean,
  message?: string,
  error?: string,
  data?: any
}


/**
 * The response object of a webservice.
 */
export interface GondolinWebsocketResponse extends GondolinResponse {
  type: string,
  noPopup?: boolean,
  entityImportError?: boolean
}

