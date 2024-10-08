GREEN='\033[0;32m'
NOCOLOR='\033[0m'
branch=$(git branch --show-current) 

rm -rf .next && \
echo -e "${GREEN}[1/3]: remove .next folder complete.${NOCOLOR}"
yarn build && \
rm -rf ./next/cache && \
echo -e "${GREEN}[2/3]: app build complete.${NOCOLOR}"
docker buildx build  \
    --platform linux/amd64 \
    -t registry.mapboss.co.th/customers/thaicom/durian/durian-app/$branch:$(git rev-parse --verify HEAD) \
    -t registry.mapboss.co.th/customers/thaicom/durian/durian-app/$branch:latest \
    -f Dockerfile \
	 . && \
echo -e "${GREEN}[3/3]: docker build complete.${NOCOLOR}"