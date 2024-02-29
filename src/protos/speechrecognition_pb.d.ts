import * as jspb from 'google-protobuf'

import * as google_protobuf_empty_pb from 'google-protobuf/google/protobuf/empty_pb'; // proto import: "google/protobuf/empty.proto"


export class CreateServiceRequest extends jspb.Message {
  getLanguage(): string;
  setLanguage(value: string): CreateServiceRequest;

  getTranslateLanguage(): string;
  setTranslateLanguage(value: string): CreateServiceRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateServiceRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CreateServiceRequest): CreateServiceRequest.AsObject;
  static serializeBinaryToWriter(message: CreateServiceRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateServiceRequest;
  static deserializeBinaryFromReader(message: CreateServiceRequest, reader: jspb.BinaryReader): CreateServiceRequest;
}

export namespace CreateServiceRequest {
  export type AsObject = {
    language: string,
    translateLanguage: string,
  }
}

export class DeleteServiceRequest extends jspb.Message {
  getId(): string;
  setId(value: string): DeleteServiceRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeleteServiceRequest.AsObject;
  static toObject(includeInstance: boolean, msg: DeleteServiceRequest): DeleteServiceRequest.AsObject;
  static serializeBinaryToWriter(message: DeleteServiceRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeleteServiceRequest;
  static deserializeBinaryFromReader(message: DeleteServiceRequest, reader: jspb.BinaryReader): DeleteServiceRequest;
}

export namespace DeleteServiceRequest {
  export type AsObject = {
    id: string,
  }
}

export class KeepServiceAliveRequest extends jspb.Message {
  getId(): string;
  setId(value: string): KeepServiceAliveRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): KeepServiceAliveRequest.AsObject;
  static toObject(includeInstance: boolean, msg: KeepServiceAliveRequest): KeepServiceAliveRequest.AsObject;
  static serializeBinaryToWriter(message: KeepServiceAliveRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): KeepServiceAliveRequest;
  static deserializeBinaryFromReader(message: KeepServiceAliveRequest, reader: jspb.BinaryReader): KeepServiceAliveRequest;
}

export namespace KeepServiceAliveRequest {
  export type AsObject = {
    id: string,
  }
}

export class TranslationRequest extends jspb.Message {
  getText(): string;
  setText(value: string): TranslationRequest;

  getLanguage(): string;
  setLanguage(value: string): TranslationRequest;

  getTranslateLanguage(): string;
  setTranslateLanguage(value: string): TranslationRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): TranslationRequest.AsObject;
  static toObject(includeInstance: boolean, msg: TranslationRequest): TranslationRequest.AsObject;
  static serializeBinaryToWriter(message: TranslationRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): TranslationRequest;
  static deserializeBinaryFromReader(message: TranslationRequest, reader: jspb.BinaryReader): TranslationRequest;
}

export namespace TranslationRequest {
  export type AsObject = {
    text: string,
    language: string,
    translateLanguage: string,
  }
}

export class RecognitionResponse extends jspb.Message {
  getText(): string;
  setText(value: string): RecognitionResponse;

  getType(): string;
  setType(value: string): RecognitionResponse;

  getTimestamp(): number;
  setTimestamp(value: number): RecognitionResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RecognitionResponse.AsObject;
  static toObject(includeInstance: boolean, msg: RecognitionResponse): RecognitionResponse.AsObject;
  static serializeBinaryToWriter(message: RecognitionResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RecognitionResponse;
  static deserializeBinaryFromReader(message: RecognitionResponse, reader: jspb.BinaryReader): RecognitionResponse;
}

export namespace RecognitionResponse {
  export type AsObject = {
    text: string,
    type: string,
    timestamp: number,
  }
}

