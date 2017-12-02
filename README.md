# dcs-assignment

install node.js

after that

run the commands in cmd/terminal show as below

```
cd ${your project root folder}/
```
e.g. cd /Users/lwk/git/dcs-assignment

Make sure there is a file "package.json" in project root folder

install project dependencies
```
npm install
```

run application
```
node ./app/main.js ${selfPort} ${anotherServerPort}
```
e.g.
```
#first server
node ./app/main.js 3000 13000
#second server
node ./app/main.js 13000 3000
```

Open browser and access
http://localhost:38080/
