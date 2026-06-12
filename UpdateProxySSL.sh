#!/bin/bash

# Script para actualizar el Nginx Proxy actual e integrar Let's Encrypt Companion
RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}======================================================${NC}"
echo -e "${CYAN}     Modernización de Nginx Proxy + Let's Encrypt     ${NC}"
echo -e "${CYAN}======================================================${NC}"

# Buscar si el proxy de apidian está corriendo y detenerlo
PROXY_CONTAINER=$(docker ps -a --format '{{.Names}}' | grep -E 'proxy|apidian_proxy' | head -n 1)

if [ ! -z "$PROXY_CONTAINER" ]; then
    echo -e "${CYAN}Deteniendo contenedor proxy antiguo: $PROXY_CONTAINER...${NC}"
    docker stop $PROXY_CONTAINER > /dev/null 2>&1
    docker rm $PROXY_CONTAINER > /dev/null 2>&1
    echo -e "${GREEN}Proxy antiguo removido.${NC}"
fi

# Crear red si no existe (por seguridad)
docker network create proxynet > /dev/null 2>&1 || true

# Crear volúmenes para configuración compartida de Let's Encrypt
echo -e "${CYAN}Generando volúmenes compartidos de Nginx...${NC}"
docker volume create nginx_vhost > /dev/null 2>&1
docker volume create nginx_html > /dev/null 2>&1
docker volume create nginx_certs > /dev/null 2>&1
docker volume create nginx_acme > /dev/null 2>&1

echo -e "${CYAN}Levantando Nginx Proxy Modernizado...${NC}"

docker run -d -p 80:80 -p 443:443 \
    --name nginx-proxy \
    --restart unless-stopped \
    --network proxynet \
    -v nginx_certs:/etc/nginx/certs:ro \
    -v nginx_vhost:/etc/nginx/vhost.d \
    -v nginx_html:/usr/share/nginx/html \
    -v /var/run/docker.sock:/tmp/docker.sock:ro \
    nginxproxy/nginx-proxy:latest

echo -e "${CYAN}Levantando Let's Encrypt Companion (acme-companion)...${NC}"

docker run -d \
    --name nginx-proxy-acme \
    --restart unless-stopped \
    --network proxynet \
    --volumes-from nginx-proxy \
    -v nginx_certs:/etc/nginx/certs:rw \
    -v nginx_acme:/etc/acme.sh \
    -v /var/run/docker.sock:/var/run/docker.sock:ro \
    nginxproxy/acme-companion:latest

echo -e "${GREEN}======================================================${NC}"
echo -e "${GREEN}¡Proxy con soporte automático de SSL configurado!${NC}"
echo -e "A partir de este momento, cualquier contenedor conectado a 'proxynet'"
echo -e "con las variables VIRTUAL_HOST, LETSENCRYPT_HOST y LETSENCRYPT_EMAIL"
echo -e "recibirá su certificado SSL automáticamente en un par de minutos."
echo -e "${GREEN}======================================================${NC}"
