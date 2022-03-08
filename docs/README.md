# Wojewodztwa Chart (WordPress plugin)

A shortcode (`wojewodztwa_chart`) to display a chart with Polish voivodships with data from a given URL.

## Getting Started

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes. See deployment for notes on how to deploy the project on a live system.

### Prerequisites

Current WordPress (tested on 3.9, 5.5, 5.7, 5.9).

### Installing

The development version can be installed by putting the `wp-wojewodztwa-chart` directory (with all the files) in `wp-content/plugins/`.

When using a Linux console:

```
cd $HOME
git clone https://github.com/tomaszn/wp-wojewodztwa-chart.git
ln -s wp-wojewodztwa-chart/wp-wojewodztwa-chart www/wp-content/plugins/
```

Log in as administrator to WP, check if the plugin is on the list and `Activate` it.

## Supported shortcode parameters

Shortcode name: `wojewodztwa_chart`

* data: URL to a data file, see below
* column: column name from data file
* scheme: continuous interpolator name from [d3-scale-chromatic docs](https://github.com/d3/d3-scale-chromatic), default: "interpolateBlues"
* ticks: [approximate number of representative values](https://github.com/d3/d3-scale/blob/master/README.md#continuous_ticks), default: 5
* tick\_format: display format for generated thresholds, see [d3-format#locale\_format](https://github.com/d3/d3-format#locale_format), default: "d" ("decimal notation, rounded to integer")

Example:
```
[wojewodztwa_chart data="https://mysite.pl/wp-content/uploads/2018/04/mapa_testowe_dane.tsv" column="AVG_FWQ"]
```

## Supported data format

Data files are tab-separated values (TSV), encoded in UTF-8, for example:
```
WOJEWÓDZTWO	AVG_FWQ	SUM_KL
dolnośląskie	110.16	159
...
```
Excel users can "Save as..." as "Text (Tab delimited) (\*.txt)", then reopen in Notepad and "Save as..." as "Unicode (UTF-8)".

## Authors

* **Tomasz Nowak** - *Initial work* - [tomaszn](https://github.com/tomaszn)

See also the list of [contributors](https://github.com/tomaszn/wp-wojewodztwa-chart/graphs/contributors) who participated in this project.

## License

This project is licensed under the GPLv2 license - see the [LICENSE](https://github.com/tomaszn/wp-wojewodztwa-chart/blob/master/LICENSE) file for details.
