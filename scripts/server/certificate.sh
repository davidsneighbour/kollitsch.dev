#!/bin/bash

# private key for the root cert
openssl genrsa -out private.key 4096

# root certificate
openssl req -x509 -new -nodes -key private.key -config certificate.conf -days 365 -out public.crt

# openssl x509 -in domain.crt -noout -text

# private key for the server cert
openssl genrsa -out server.key 2048

# signing request for the server
# openssl req -new -key stubhub.key -out stubhub.csr
openssl req -new -key server.key -config certificate.conf -out server.csr

# server cert using the root certificate
openssl x509 -req -in server.csr -CA public.crt -CAkey private.key -CAcreateserial -out server.crt -days 365 -sha256
