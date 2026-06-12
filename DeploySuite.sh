#!/bin/bash

# Script automatizado para desplegar Frontend y Backend en la red de Apidian
RED='\033[0;31m'
GREEN='\033[0;32m'
CYAN='\033[0;36m'
NC='\033[0m'

echo -e "${CYAN}======================================================${NC}"
echo -e "${CYAN}     Despliegue de Suite Soltec (Frontend + Backend)  ${NC}"
echo -e "${CYAN}======================================================${NC}"

# Verificar si el proxy existe (red proxynet)
if ! docker network ls | grep -q "proxynet"; then
    echo -e "${RED}Error: La red 'proxynet' no existe.${NC}"
    echo "Asegúrate de haber ejecutado InstallAPIDocker.sh primero para que el Proxy esté corriendo."
    exit 1
fi

echo -e "${GREEN}Red proxynet encontrada. Iniciando compilación y despliegue...${NC}"

# Compilar y levantar los contenedores en background
docker-compose -f docker-compose.suite.yml up -d --build

if [ $? -eq 0 ]; then
    echo -e "${GREEN}¡Despliegue completado con éxito!${NC}"
    echo -e "Tus servicios estarán disponibles en breve:"
    echo -e " - Frontend: ${CYAN}http://betel.tecnologiaydesarrollo.net${NC}"
    echo -e " - Backend:  ${CYAN}http://betel-api.tecnologiaydesarrollo.net${NC}"
    echo ""
    echo "Si utilizas un contenedor 'acme-companion' en tu servidor, los certificados SSL (HTTPS) se generarán automáticamente en los próximos minutos."
else
    echo -e "${RED}Hubo un error durante el despliegue.${NC}"
    exit 1
fi
