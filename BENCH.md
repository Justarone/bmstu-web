Запросы слались по адресу `http(s)://localhost/api/v1/player`, по которому ожидается список всех доступных игроков.

На момент тестирования данных список имел вид:

```json
[
   {
      "id":1,
      "fname":"pavel",
      "lname":"bure",
      "cntry":"russia",
      "dob":"2020-12-12T00:00:00.000Z"
   },
   {
      "id":2,
      "fname":"pavel",
      "lname":"bure",
      "cntry":"russia",
      "dob":"2020-12-12T00:00:00.000Z"
   },
   {
      "id":3,
      "fname":"pavel",
      "lname":"bure",
      "cntry":"russia",
      "dob":"2020-12-12T00:00:00.000Z"
   },
   {
      "id":4,
      "fname":"pavel",
      "lname":"bure",
      "cntry":"russia",
      "dob":"2020-12-12T00:00:00.000Z"
   },
   {
      "id":5,
      "fname":"pavel",
      "lname":"bure",
      "cntry":"russia",
      "dob":"2020-12-12T00:00:00.000Z"
   },
   {
      "id":6,
      "fname":"pavel",
      "lname":"bure",
      "cntry":"russia",
      "dob":"2020-12-12T00:00:00.000Z"
   },
   {
      "id":7,
      "fname":"pavel",
      "lname":"bure",
      "cntry":"russia",
      "dob":"2020-12-12T00:00:00.000Z"
   },
   {
      "id":8,
      "fname":"pavel",
      "lname":"bure",
      "cntry":"russia",
      "dob":"2020-12-12T00:00:00.000Z"
   },
   {
      "id":9,
      "fname":"pavel",
      "lname":"bure",
      "cntry":"russia",
      "dob":"2020-12-12T00:00:00.000Z"
   },
   {
      "id":10,
      "fname":"pavel",
      "lname":"bure",
      "cntry":"russia",
      "dob":"2020-12-12T00:00:00.000Z"
   },
   {
      "id":11,
      "fname":"pavel",
      "lname":"bure",
      "cntry":"russia",
      "dob":"2020-12-12T00:00:00.000Z"
   },
   {
      "id":12,
      "fname":"pavel",
      "lname":"bure",
      "cntry":"russia",
      "dob":"2020-12-12T00:00:00.000Z"
   },
   {
      "id":13,
      "fname":"pavel",
      "lname":"bure",
      "cntry":"russia",
      "dob":"2020-12-12T00:00:00.000Z"
   },
   {
      "id":14,
      "fname":"pavel",
      "lname":"bure",
      "cntry":"russia",
      "dob":"2020-12-12T00:00:00.000Z"
   },
   {
      "id":16,
      "fname":"pavel",
      "lname":"bure",
      "cntry":"russia",
      "dob":"2020-12-12T00:00:00.000Z"
   },
   {
      "id":17,
      "fname":"pavel",
      "lname":"bure",
      "cntry":"russia",
      "dob":"2020-12-12T00:00:00.000Z"
   },
   {
      "id":18,
      "fname":"pavel",
      "lname":"bure",
      "cntry":"russia",
      "dob":"2020-12-12T00:00:00.000Z"
   },
   {
      "id":19,
      "fname":"pavel",
      "lname":"bure",
      "cntry":"russia",
      "dob":"2020-12-12T00:00:00.000Z"
   }
]
```

Тестирование по http с балансировкой 2:1:1:

```bash
ab -c 10 -n 10000 http://localhost/api/v1/player
This is ApacheBench, Version 2.3 <$Revision: 1843412 $>
Copyright 1996 Adam Twiss, Zeus Technology Ltd, http://www.zeustech.net/
Licensed to The Apache Software Foundation, http://www.apache.org/

Benchmarking localhost (be patient)
Completed 1000 requests
Completed 2000 requests
Completed 3000 requests
Completed 4000 requests
Completed 5000 requests
Completed 6000 requests
Completed 7000 requests
Completed 8000 requests
Completed 9000 requests
Completed 10000 requests
Finished 10000 requests


Server Software:        hockey
Server Hostname:        localhost
Server Port:            80

Document Path:          /api/v1/player
Document Length:        1630 bytes

Concurrency Level:      10
Time taken for tests:   8.534 seconds
Complete requests:      10000
Failed requests:        0
Total transferred:      21790000 bytes
HTML transferred:       16300000 bytes
Requests per second:    1171.83 [#/sec] (mean)
Time per request:       8.534 [ms] (mean)
Time per request:       0.853 [ms] (mean, across all concurrent requests)
Transfer rate:          2493.58 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    0   0.0      0       1
Processing:     1    8   9.5      7     224
Waiting:        1    8   9.5      7     224
Total:          1    8   9.5      7     224

Percentage of the requests served within a certain time (ms)
  50%      7
  66%      8
  75%      9
  80%     10
  90%     12
  95%     15
  98%     19
  99%     36
 100%    224 (longest request)
```

Тестирование по https с балансировкой 2:1:1:

```bash
ab -c 10 -n 10000 https://localhost/api/v1/player
This is ApacheBench, Version 2.3 <$Revision: 1843412 $>
Copyright 1996 Adam Twiss, Zeus Technology Ltd, http://www.zeustech.net/
Licensed to The Apache Software Foundation, http://www.apache.org/

Benchmarking localhost (be patient)
Completed 1000 requests
Completed 2000 requests
Completed 3000 requests
Completed 4000 requests
Completed 5000 requests
Completed 6000 requests
Completed 7000 requests
Completed 8000 requests
Completed 9000 requests
Completed 10000 requests
Finished 10000 requests


Server Software:        hockey
Server Hostname:        localhost
Server Port:            443
SSL/TLS Protocol:       TLSv1.2,ECDHE-RSA-AES256-GCM-SHA384,2048,256
Server Temp Key:        X25519 253 bits
TLS Server Name:        localhost

Document Path:          /api/v1/player
Document Length:        1630 bytes

Concurrency Level:      10
Time taken for tests:   20.878 seconds
Complete requests:      10000
Failed requests:        0
Total transferred:      21790000 bytes
HTML transferred:       16300000 bytes
Requests per second:    478.98 [#/sec] (mean)
Time per request:       20.878 [ms] (mean)
Time per request:       2.088 [ms] (mean, across all concurrent requests)
Transfer rate:          1019.24 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        2   11   1.8     11      38
Processing:     2   10   8.2      9     311
Waiting:        2   10   8.2      9     311
Total:          4   21   8.4     20     331

Percentage of the requests served within a certain time (ms)
  50%     20
  66%     21
  75%     21
  80%     22
  90%     23
  95%     24
  98%     27
  99%     33
 100%    331 (longest request)
```

Тестирование по http без балансировки:
```bash
This is ApacheBench, Version 2.3 <$Revision: 1843412 $>
Copyright 1996 Adam Twiss, Zeus Technology Ltd, http://www.zeustech.net/
Licensed to The Apache Software Foundation, http://www.apache.org/

Benchmarking localhost (be patient)
Completed 1000 requests
Completed 2000 requests
Completed 3000 requests
Completed 4000 requests
Completed 5000 requests
Completed 6000 requests
Completed 7000 requests
Completed 8000 requests
Completed 9000 requests
Completed 10000 requests
Finished 10000 requests


Server Software:        hockey
Server Hostname:        localhost
Server Port:            80

Document Path:          /api/v1/player
Document Length:        1630 bytes

Concurrency Level:      10
Time taken for tests:   9.513 seconds
Complete requests:      10000
Failed requests:        0
Total transferred:      21790000 bytes
HTML transferred:       16300000 bytes
Requests per second:    1051.17 [#/sec] (mean)
Time per request:       9.513 [ms] (mean)
Time per request:       0.951 [ms] (mean, across all concurrent requests)
Transfer rate:          2236.82 [Kbytes/sec] received

Connection Times (ms)
              min  mean[+/-sd] median   max
Connect:        0    0   0.2      0       7
Processing:     2    9   8.7      9     286
Waiting:        2    9   8.7      8     286
Total:          3    9   8.7      9     286

Percentage of the requests served within a certain time (ms)
  50%      9
  66%     10
  75%     10
  80%     11
  90%     12
  95%     14
  98%     16
  99%     17
 100%    286 (longest request)
```

Выводы:

1. По https работает ощутимо медленнее
2. С балансировкой работает быстрее, полагаю, ввиду однопоточности node.js
