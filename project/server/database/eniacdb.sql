\set QUIET true
SET client_min_messages TO WARNING; -- Less talk please.
DROP SCHEMA public CASCADE;
CREATE SCHEMA public;
GRANT ALL ON SCHEMA public TO postgres;
\set QUIET false

CREATE TABLE Managers(
    name TEXT,

    PRIMARY KEY (name)
);

CREATE TABLE Stocks (
    name TEXT,
    price INTEGER,
    country TEXT,
    procent DECIMAL(7,2),

    PRIMARY KEY(name)
);

CREATE TABLE Labels(
    name TEXT,
    weight INTEGER,

    PRIMARY KEY(name)
);

CREATE TABLE StocksWithLabels(
    stock TEXT,
    label TEXT,

    PRIMARY KEY(stock,label),
    FOREIGN KEY(stock) REFERENCES Stocks(name),
    FOREIGN KEY(label) REFERENCES Labels(name)
);

CREATE TABLE Portfolios(
    manager TEXT,
    stock TEXT,
    volume INTEGER,

    PRIMARY KEY (manager,stock),
    FOREIGN KEY (manager) REFERENCES Managers(name),
    FOREIGN KEY (stock) REFERENCES Stocks(name)
);

INSERT INTO Stocks VALUES('Tesla',120,'USA',-0.14);
INSERT INTO Stocks VALUES('Volvo',125,'SE',0.14);
INSERT INTO Stocks VALUES('Scania',122,'SE',0.15);
INSERT INTO Stocks VALUES('Snapchat',121,'USA',0.16);
INSERT INTO Stocks VALUES('Einride',123,'GER',0.17);

INSERT INTO Labels VALUES('coronavinnare',1);
INSERT INTO Labels VALUES('coronaförlorare',1);
INSERT INTO Labels VALUES('kort',1);
INSERT INTO Labels VALUES('lång',1);
INSERT INTO Labels VALUES('bred',1);
INSERT INTO Labels VALUES('smal',1);

INSERT INTO Managers VALUES('Alex');
INSERT INTO Managers VALUES('Albin');
INSERT INTO Managers VALUES('Carl');
INSERT INTO Managers VALUES('Emil');
INSERT INTO Managers VALUES('Aline');

INSERT INTO StocksWithLabels VALUES('Tesla','kort');
INSERT INTO StocksWithLabels VALUES('Volvo','lång');
INSERT INTO StocksWithLabels VALUES('Scania','coronavinnare');
INSERT INTO StocksWithLabels VALUES('Snapchat','coronaförlorare');
INSERT INTO StocksWithLabels VALUES('Einride','bred');

INSERT INTO Portfolios VALUES('Alex','Volvo',100);
INSERT INTO Portfolios VALUES('Alex','Tesla',312);
INSERT INTO Portfolios VALUES('Alex','Snapchat',234);
INSERT INTO Portfolios VALUES('Alex','Scania',654);
INSERT INTO Portfolios VALUES('Albin','Volvo',43);
INSERT INTO Portfolios VALUES('Albin','Scania',654);
INSERT INTO Portfolios VALUES('Albin','Einride',345);
INSERT INTO Portfolios VALUES('Carl','Einride',1234);
INSERT INTO Portfolios VALUES('Carl','Volvo',123);
INSERT INTO Portfolios VALUES('Emil','Snapchat',123);

CREATE VIEW PortfolioInfo AS 
(SELECT manager, StocksWithLabels.label AS label, country, Portfolios.stock, procent, price*volume AS amount
FROM Managers, Portfolios, Stocks, StocksWithLabels
WHERE (Managers.name = Portfolios.manager) AND (Portfolios.stock = StocksWithLabels.stock)
                                           AND (Portfolios.stock = Stocks.name)
GROUP BY(Portfolios.manager, StocksWithLabels.label, country, Portfolios.stock,procent,amount)
);
