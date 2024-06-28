from numpy import std, sum, corrcoef, float32
from sys import path
path.append("/data/polygon")
from tool.mysql import DataBaseHandle
from tool.clickhouse import DataBaseHandle as ch_DataBaseHandle
from pandas import DataFrame


"""采用CRITIC法确定用户的权重，从信息完善度，参与dao数量，创建提案数量，参与投票次数，受到委托次数，参与dao综合评分等六个
   方面确定；没有定义操作clickhouse的库，其在服务器上已经定义好；代码以服务器的为准
"""


parameters = {"host": "database-2.chp3rojpib7v.ap-east-1.rds.amazonaws.com", "username": "admin",
              "password": "cGaeFsDKwWZVQWr", "database": "bhousedao_prod", "port": 3306}
mysql = DataBaseHandle(**parameters)

# 基础信息完善度 addr: 73583
sql_statement1 = """select addr, 
                    if(name is null, 0, 1) + if(avatar_url is null, 0, 1) + if(banner_url is null, 0, 1)
                    + if(description is null, 0, 1) + if(skills is null, 0, 1) + if(tag is null, 0, 1) 
                    + if(twitter is null, 0, 1) + if(discord is null, 0, 1) + if(telegram is null, 0, 1)
                    + if(mirror is null, 0, 1) + if(website is null, 0, 1) + if(email is null, 0, 1) as nums
                    from bhousedao_prod.`user`
                    where addr is not null"""

result = mysql.select_db(sql_statement1)
data = DataFrame.from_records(result, columns=["addr", "completeness"])
del result

# 参与DAO数量 member_address: 6134452
sql_statement2 = """select member_address as addr, count(distinct dao_id)
                    from dao_proposal_member
                    group by 1"""
result = mysql.select_db(sql_statement2)
data2 = DataFrame.from_records(result, columns=["addr", "daos"])
del result
data2 = data2.merge(data, how='outer', on='addr')
del data

# 创建提案数量 author: 141438
ch_statement = """select author as addr, count(id) as proposals
                    from dao_proposal
                    group by addr"""
clickhouse = ch_DataBaseHandle()
data = clickhouse.select_db(ch_statement)
data2 = data2.merge(data, how='outer', on='addr')
del data

# 参与投票次数 voter_address: 6106440
ch_statement2 = """select voter_address as addr, count(id) as votes
                    from dao_proposal_voter
                    group by addr"""
data = clickhouse.select_db(ch_statement2)
data2 = data2.merge(data, how='outer', on='addr')
del data

# 受到委托次数 delegate: 127408
sql_statement5 = """select receiver as addr, count(*)
                    from dao_proposal_delegation
                    group by 1"""
result = mysql.select_db(sql_statement5)
data = DataFrame.from_records(result, columns=["addr", "delegations"])
del result
data2 = data2.merge(data, how='outer', on='addr')
del data
#mysql.close_db()

# voting power加权 voter: 6106588
#ch_statement3 = """SELECT voter_address as addr, round(avg(score / NULLIF(total_score, 0)),3) AS voting_power_ratio
#                  FROM dao_proposal_voter
#                  LEFT JOIN
#                  (SELECT dao_proposal_id, sum(score) AS total_score
#                   FROM dao_proposal_voter
#                   GROUP BY dao_proposal_id) AS subquery USING (dao_proposal_id)
#                   where total_score > 0
#                  GROUP BY addr"""

ch_statement3 = """SELECT voter_address as addr,dao_id, score/total_score as score_ratio
                   from (
                       SELECT *
                       FROM (SELECT *, ROW_NUMBER() OVER (PARTITION BY voter_address, dao_id ORDER BY created DESC) AS rn
                             FROM dao_proposal_voter final where dao_id in (535,    441,    504,    621,    603,    459,    552,    455,
          495,    606,    340,    608,    464,    444,    628,    624,
          930,    931,    932,    934,    935,    936,    937,    939,
          940,    941,    942,    943,    944,    945,    946,    947,
          948,    949,    950,    951,    952,    953,    954,    955,
          958,    960,    961,    963,    964,    965,    966,    967,
          968,    970,    971,    972,    973,    975,    976,    978,
          983,    984,    987,    988,    990,    991,    992,    995,
          997,    998,    999,   1000,   1001,   1003,   1004,   1010,
         1011,   1013,   1014,   1016,   1018,   1025,   1026,   1028,
         1029,   1030,   1033,   1038,   1039,   1040,   1041,   1042,
         1047,   1075,   1115,   1117,   1121,   1129,   1133,   1177,
         1207,   1212,   1215,   1216,   1217,   1220,   1181,    933,
          959,   1230,   1234,   1237,   1241,   1243,   1246,   1247,
         1248,   1249,   1253,   1255,   1258,   1265,   1269,   1308,
         1309,   1363,   1373,   1374,   1377,   1379,   1380,   1381,
         1382,   1425,   1473,   1485,   1531,   1536,   1557,   1560,
         1589,   1602,   1608,   1651,   1668,   1692,   1737,   1739,
         1746,   1753,   1755,   1758,   1759,   1760,   1765,   1766,
         1771,   1776,   1781,   1782,   1788,   1772,   3924,   4122,
         9104,  37374,  37425,  37447,  46719,  46724, 104550, 104556,
        18632, 104563,  28512, 104566,  21377,  15168,  29226, 104572,
       104581, 139206, 139810, 139811, 139861, 139897, 139939, 139941,
       139947, 139948, 139968, 139986, 140003, 140021, 140042, 140112,
       140187, 140230, 140242, 140295, 140358, 140359, 140408, 140427,
       140449, 140450, 140452, 140504, 140508, 140522, 140546, 140550,
       140603, 140617, 140648, 140653, 140657, 140670, 140680, 140710,
       140711, 140729, 140745, 140756, 140774, 140799, 140821, 140847,
       140851, 140854, 140916, 141060, 141133, 141183, 141401, 141428,
       141811, 141901, 141936, 142048, 142135, 142137, 142858, 142884,
       142958, 142971, 147308, 151888,   1150, 109053,  19906,   1375,
         1779, 139805,   1376,  18210,  13318,  18938,  46127,  16006,
        17440,  19585, 154700, 155806, 157090, 171672, 174125, 174126,
       171740, 175343, 178771, 179112,   1856,    689, 184903, 185501)) AS subquery
                       WHERE rn = 1) a
                   LEFT join (
                        SELECT dao_proposal_id, sum(score) AS total_score
                        FROM dao_proposal_choice final
                        GROUP BY dao_proposal_id ) AS subquery USING (dao_proposal_id) 
                   WHERE total_score > 0"""

sql_statement6 = """SELECT dao_id ,max(market_cap) as market_cap
                    FROM dao_governance_token t1
                    LEFT JOIN beep_coin t2  
                    ON t1.contract_address = t2.contract_address
                    WHERE market_cap >0
                    GROUP BY dao_id"""
data = clickhouse.select_db(ch_statement3)
data_ = DataFrame.from_records(mysql.select_db(sql_statement6), columns=["dao_id", "market_cap"])
data = data.merge(data_, how='left', on='dao_id')
data.fillna(0, inplace=True)
del data_
data["market_cap"] = data["market_cap"]*data["score_ratio"]
data = data.groupby(["addr"])["market_cap"].sum()
data2 = data2.merge(data, how='outer', on='addr')
del data

#ch_statement4 = """select voter_address as addr, count distinct(FROM_UNIXTIME(created, '%Y-%m')) as months_1
#                    from dao_proposal_voter
#                    group by addr"""
#data = clickhouse.select_db(ch_statement4)
#ch_statement5 = """select voter_address as addr, count distinct(FROM_UNIXTIME(created, '%Y-%m')) as months_2
#                    from dao_proposal
#                    group by addr"""
#data_2 = clickhouse.select_db(ch_statement5)
#data = data.merge(data_2, how="left", on="addr")
#data.fillna(0, inplace=True)
#data["month"] = data["months_1"] + data["months_2"]
#data=data[["addr", "month"]]
#data2 = data2.merge(data, how='outer', on='addr')
#del data
#del data_2

data2.fillna(0, inplace=True)

print(data2.shape)
print(data2.columns)
print(data2.head())

X = data2[["completeness", "daos", "proposals", "votes", "delegations", "voting_power_ratio"]].values.astype(float32)
del data2
X_norm = (X - X.min(axis=0)) / (X.max(axis=0) - X.min(axis=0))
del X
""" CRITIC法
sigma = std(X_norm, axis=0)
R = sum(1 - corrcoef(X_norm.T), axis=0)
C = sigma * R
weights = C / sum(C)
"""
""" 熵值法
from numpy import log, sum
P = X_norm/X_norm.sum(axis=0)+0.001
e = 1+1/log(len(P[0]))*sum(P*log(P), axis=0)
weights = e/sum(e)
"""
from numpy import mean
cov = std(X_norm, axis=0)/mean(X_norm, axis=0)
weights = cov/cov.sum()

mysql = DataBaseHandle()
sql_statement = """insert into dynamic_nft_weights(completeness, daos, proposals, votes, delegations, market_cap)
                   values(%s, %s, %s, %s, %s, %s)"""
mysql.insert_db(sql_statement, weights.tolist())
mysql.close_db()

print(["completeness", "daos", "proposals", "votes", "delegations", "market_cap"])
print("权重: ", weights)
