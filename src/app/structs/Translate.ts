export class TranslateResponse{
  data : TranslateTextResponseList = new TranslateTextResponseList
}

export class TranslateTextResponseList{
  translations : TranslateTextResponseTranslation[] = []
}

export class TranslateTextResponseTranslation{
  detectedSourceLanguage : string = ""
  model : string = ""
  translatedText : string = ""
}
