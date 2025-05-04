Змонтувати документацію

```docker build -t openipc-docs .```

Оновити білд без кэшу

```docker build --no-cache -t openipc-docs .```

Старт doker container

```docker run -d --name openipc-docs -p 8888:80 openipc-docs```

Стоп doker container

```docker stop openipc-docs && docker rm openipc-docs```
