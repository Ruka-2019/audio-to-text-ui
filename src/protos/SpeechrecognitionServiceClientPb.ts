/**
 * @fileoverview gRPC-Web generated client stub for speechrecognition
 * @enhanceable
 * @public
 */

// Code generated by protoc-gen-grpc-web. DO NOT EDIT.
// versions:
// 	protoc-gen-grpc-web v1.5.0
// 	protoc              v4.25.3
// source: speechrecognition.proto


/* eslint-disable */
// @ts-nocheck


import * as grpcWeb from 'grpc-web';

import * as google_protobuf_empty_pb from 'google-protobuf/google/protobuf/empty_pb'; // proto import: "google/protobuf/empty.proto"
import * as speechrecognition_pb from './speechrecognition_pb'; // proto import: "speechrecognition.proto"


export class SpeechRecognitionServiceInterfaceClient {
  client_: grpcWeb.AbstractClientBase;
  hostname_: string;
  credentials_: null | { [index: string]: string; };
  options_: null | { [index: string]: any; };

  constructor (hostname: string,
               credentials?: null | { [index: string]: string; },
               options?: null | { [index: string]: any; }) {
    if (!options) options = {};
    if (!credentials) credentials = {};
    options['format'] = 'text';

    this.client_ = new grpcWeb.GrpcWebClientBase(options);
    this.hostname_ = hostname.replace(/\/+$/, '');
    this.credentials_ = credentials;
    this.options_ = options;
  }

  methodDescriptorCreateService = new grpcWeb.MethodDescriptor(
    '/speechrecognition.SpeechRecognitionServiceInterface/CreateService',
    grpcWeb.MethodType.SERVER_STREAMING,
    speechrecognition_pb.CreateServiceRequest,
    speechrecognition_pb.RecognitionResponse,
    (request: speechrecognition_pb.CreateServiceRequest) => {
      return request.serializeBinary();
    },
    speechrecognition_pb.RecognitionResponse.deserializeBinary
  );

  createService(
    request: speechrecognition_pb.CreateServiceRequest,
    metadata?: grpcWeb.Metadata): grpcWeb.ClientReadableStream<speechrecognition_pb.RecognitionResponse> {
    return this.client_.serverStreaming(
      this.hostname_ +
        '/speechrecognition.SpeechRecognitionServiceInterface/CreateService',
      request,
      metadata || {},
      this.methodDescriptorCreateService);
  }

  methodDescriptorDeleteService = new grpcWeb.MethodDescriptor(
    '/speechrecognition.SpeechRecognitionServiceInterface/DeleteService',
    grpcWeb.MethodType.UNARY,
    speechrecognition_pb.DeleteServiceRequest,
    google_protobuf_empty_pb.Empty,
    (request: speechrecognition_pb.DeleteServiceRequest) => {
      return request.serializeBinary();
    },
    google_protobuf_empty_pb.Empty.deserializeBinary
  );

  deleteService(
    request: speechrecognition_pb.DeleteServiceRequest,
    metadata?: grpcWeb.Metadata | null): Promise<google_protobuf_empty_pb.Empty>;

  deleteService(
    request: speechrecognition_pb.DeleteServiceRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: google_protobuf_empty_pb.Empty) => void): grpcWeb.ClientReadableStream<google_protobuf_empty_pb.Empty>;

  deleteService(
    request: speechrecognition_pb.DeleteServiceRequest,
    metadata?: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: google_protobuf_empty_pb.Empty) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/speechrecognition.SpeechRecognitionServiceInterface/DeleteService',
        request,
        metadata || {},
        this.methodDescriptorDeleteService,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/speechrecognition.SpeechRecognitionServiceInterface/DeleteService',
    request,
    metadata || {},
    this.methodDescriptorDeleteService);
  }

  methodDescriptorKeepServiceAlive = new grpcWeb.MethodDescriptor(
    '/speechrecognition.SpeechRecognitionServiceInterface/KeepServiceAlive',
    grpcWeb.MethodType.UNARY,
    speechrecognition_pb.KeepServiceAliveRequest,
    google_protobuf_empty_pb.Empty,
    (request: speechrecognition_pb.KeepServiceAliveRequest) => {
      return request.serializeBinary();
    },
    google_protobuf_empty_pb.Empty.deserializeBinary
  );

  keepServiceAlive(
    request: speechrecognition_pb.KeepServiceAliveRequest,
    metadata?: grpcWeb.Metadata | null): Promise<google_protobuf_empty_pb.Empty>;

  keepServiceAlive(
    request: speechrecognition_pb.KeepServiceAliveRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: google_protobuf_empty_pb.Empty) => void): grpcWeb.ClientReadableStream<google_protobuf_empty_pb.Empty>;

  keepServiceAlive(
    request: speechrecognition_pb.KeepServiceAliveRequest,
    metadata?: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: google_protobuf_empty_pb.Empty) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/speechrecognition.SpeechRecognitionServiceInterface/KeepServiceAlive',
        request,
        metadata || {},
        this.methodDescriptorKeepServiceAlive,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/speechrecognition.SpeechRecognitionServiceInterface/KeepServiceAlive',
    request,
    metadata || {},
    this.methodDescriptorKeepServiceAlive);
  }

  methodDescriptorGetTranslation = new grpcWeb.MethodDescriptor(
    '/speechrecognition.SpeechRecognitionServiceInterface/GetTranslation',
    grpcWeb.MethodType.UNARY,
    speechrecognition_pb.TranslationRequest,
    speechrecognition_pb.RecognitionResponse,
    (request: speechrecognition_pb.TranslationRequest) => {
      return request.serializeBinary();
    },
    speechrecognition_pb.RecognitionResponse.deserializeBinary
  );

  getTranslation(
    request: speechrecognition_pb.TranslationRequest,
    metadata?: grpcWeb.Metadata | null): Promise<speechrecognition_pb.RecognitionResponse>;

  getTranslation(
    request: speechrecognition_pb.TranslationRequest,
    metadata: grpcWeb.Metadata | null,
    callback: (err: grpcWeb.RpcError,
               response: speechrecognition_pb.RecognitionResponse) => void): grpcWeb.ClientReadableStream<speechrecognition_pb.RecognitionResponse>;

  getTranslation(
    request: speechrecognition_pb.TranslationRequest,
    metadata?: grpcWeb.Metadata | null,
    callback?: (err: grpcWeb.RpcError,
               response: speechrecognition_pb.RecognitionResponse) => void) {
    if (callback !== undefined) {
      return this.client_.rpcCall(
        this.hostname_ +
          '/speechrecognition.SpeechRecognitionServiceInterface/GetTranslation',
        request,
        metadata || {},
        this.methodDescriptorGetTranslation,
        callback);
    }
    return this.client_.unaryCall(
    this.hostname_ +
      '/speechrecognition.SpeechRecognitionServiceInterface/GetTranslation',
    request,
    metadata || {},
    this.methodDescriptorGetTranslation);
  }

}

