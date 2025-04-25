Змонтувати документацію

```docker build -t openipc-docs .```

Оновити білд

```docker build --no-cache -t openipc-docs .```

Запустить doker container

```docker run -d --name openipc-docs -p 8888:80 openipc-docs```
