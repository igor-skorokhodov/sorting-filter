import React from "react";
import "../components/Flights.css";
import Flights from "../flights.json";
interface IFieldProps {}

interface IFieldState {
  isClicked?: boolean; //флаг клика
  downActive: boolean; //флаг нажатия на ячейку
  flights: any[];
  Compare: { LESS_THAN: -1; BIGGER_THAN: 1 }; //массив ячеек
  quantity: number;
  valueFrom: number;
  valueTill: number;
  companies: any[];
  company: string;
}

let FLIGHTS = (Flights as any).result.flights;

export default class Field extends React.Component<IFieldProps, IFieldState> {
  constructor(props: IFieldProps) {
    super(props);
    this.state = {
      isClicked: false,
      downActive: false,
      flights: FLIGHTS,
      Compare: {
        LESS_THAN: -1,
        BIGGER_THAN: 1,
      },
      quantity: 10,
      valueFrom: 0,
      valueTill: 0,
      companies: [],
      company: "",
    };
  }

  sortUp(arr: any) {
    let array = arr.sort((a: any, b: any) =>
      Number(a.flight.price.total.amount) > Number(b.flight.price.total.amount)
        ? 1
        : -1
    );
    this.setState({ flights: array });
  }

  sortDown(arr: any) {
    let array = arr.sort((a: any, b: any) =>
      Number(a.flight.price.total.amount) < Number(b.flight.price.total.amount)
        ? 1
        : -1
    );
    this.setState({ flights: array });
  }

  sortTimeInAWay(arr: any) {
    let array = arr.sort((a: any, b: any) =>
      Number(
        a.flight.legs[0].segments[0].travelDuration +
          (a.flight.legs[0].segments[1]
            ? a.flight.legs[0].segments[1].travelDuration
            : 0) +
          a.flight.legs[1].segments[0].travelDuration +
          (a.flight.legs[1].segments[1]
            ? a.flight.legs[1].segments[1].travelDuration
            : 0)
      ) >
      Number(
        b.flight.legs[0].segments[0].travelDuration +
          (b.flight.legs[0].segments[1]
            ? b.flight.legs[0].segments[1].travelDuration
            : 0) +
          b.flight.legs[1].segments[0].travelDuration +
          (b.flight.legs[1].segments[1]
            ? b.flight.legs[1].segments[1].travelDuration
            : 0)
      )
        ? 1
        : -1
    );
    this.setState({ flights: array });
  }

  filterStraight(arr: any) {
    let array = [];
    let array2 = FLIGHTS;
    for (let i = 0, j = 0; i < array2.length; i++) {
      if (
        array2[i].flight.legs[0].segments.length === 1 &&
        array2[i].flight.legs[1].segments.length === 1
      ) {
        array[j] = array2[i];
        j++;
      }
    }
    this.setState({ flights: array }, this.renderCompanies);
  }

  filterChange(arr: any) {
    let array = [];
    let array2 = FLIGHTS;
    for (let i = 0, j = 0; i < array2.length; i++) {
      if (
        array2[i].flight.legs[0].segments.length === 2 &&
        array2[i].flight.legs[1].segments.length === 2
      ) {
        array[j] = array2[i];
        j++;
      }
    }
    this.setState({ flights: array }, this.renderCompanies);
  }

  setDateAndTime(date: string) {
    let fullDate = Array.from(date);
    let year = [];
    let month = [];
    let day = [];
    let time = [];
    for (let i = 2; i < 4; i++) {
      year.push(fullDate[i]);
    }
    for (let i = 5; i < 7; i++) {
      month.push(fullDate[i]);
    }
    for (let i = 8; i < 10; i++) {
      day.push(fullDate[i]);
    }
    for (let i = 11; i < 16; i++) {
      time.push(fullDate[i]);
    }
    return (
      time.join("") +
      " " +
      day.join("") +
      "." +
      month.join("") +
      "." +
      year.join("")
    );
  }

  upQuantity() {
    this.setState({ quantity: this.state.quantity + 10 });
  }

  getTimeFromMins(mins: any) {
    let hours = Math.trunc(mins / 60);
    let minutes = mins % 60;
    return hours + " ч. " + minutes + " мин.";
  }

  componentDidMount() {
    this.setState({ flights: FLIGHTS });
    this.renderCompanies();
  }

  handleChangeFrom(event: any) {
    this.setState({ valueFrom: event.target.value });
  }

  handleChangeTill(event: any) {
    this.setState({ valueTill: event.target.value });
  }

  filterPrice() {
    let array = [];
    let array2 = FLIGHTS;
    for (let i = 0, j = 0; i < array2.length; i++) {
      if (
        Number(array2[i].flight.price.total.amount) > this.state.valueFrom &&
        Number(array2[i].flight.price.total.amount) < this.state.valueTill
      ) {
        array[j] = array2[i];
        j++;
        console.log(this.state.valueFrom);
        console.log(this.state.valueTill);
      }
    }
    this.setState({ flights: array });
  }

  filterCompany(company: any) {
    let array = [];
    let array2 = FLIGHTS;
    for (let i = 0, j = 0; i < array2.length; i++) {
      if (array2[i].flight.carrier.caption === company) {
        array[j] = array2[i];
        j++;
      }
    }
    this.setState({ flights: array });
  }

  filterDrop () {
    this.setState({flights: FLIGHTS}, this.renderCompanies)
  }

  renderCompanies() {
    let array: any[] = [];
    let array2 = this.state.flights;
    for (let i = 1; i < array2.length; i++) {
      array[i] = array2[i].flight.carrier.caption;
    }
    this.setState({ companies: array.filter((val, ind, arr) => arr.indexOf(val) === ind) });
  }

  handleButtonClick() {
    this.render();
  }

  render() {
    return (
      <>
        <div className="NewDiv">
          <div className="filter_container">
            <div className="price_filter_container">
              Сортировать по:
              <button
                className="button_short"
                onClick={() => {
                  this.sortUp(this.state.flights);
                }}
              >
                Возрастанию цены
              </button>
              <button
                className="button_short"
                onClick={() => {
                  this.sortDown(this.state.flights);
                }}
              >
                Убыванию цены
              </button>
              <button
                className="button_short"
                onClick={() => {
                  this.sortTimeInAWay(this.state.flights);
                }}
              >
                Длительности путешествия
              </button>
            </div>
            <div className="price_filter_container">
              Фильтровать
              <button
                className="button_short"
                onClick={() => {
                  this.filterStraight(this.state.flights);
                }}
              >
                Без пересадок
              </button>
              <button
                className="button_short"
                onClick={() => {
                  this.filterChange(this.state.flights);
                }}
              >
                1 пересадка
              </button>
              <button
                className="button_short"
                onClick={() => {
                  this.filterDrop();
                }}
              >
                Сбросить фильтры
              </button>
            </div>
            <div className="price_filter_container">
              Введите диапазон цен
              <input
                className="input"
                type="number"
                value={this.state.valueFrom}
                onChange={this.handleChangeFrom.bind(this)}
                placeholder="от"
              />
              <input
                className="input"
                type="number"
                value={this.state.valueTill}
                onChange={this.handleChangeTill.bind(this)}
                placeholder="до"
              />
              <button
                className="button_short"
                onClick={() => {
                  this.filterPrice();
                }}
              >
                Фильтровать
              </button>
            </div>
            <div className="price_filter_container_ac">    
              <p className="ac_header"> Авиакомпании</p>
              {this.state.companies.map((company, i) => {
                  return (
                    <>
                        <button
                          className="button_small"
                          onClick={() => {
                            this.filterCompany(company);
                          }}
                        >
                          {company}
                        </button>
                    </>
                  );
                }
              )}
            </div>
          </div>
          <div className="field">
            {this.state.flights.map((flight, i) => {
              if (i < this.state.quantity) {
                return (
                  <>
                    <div className="flight">
                      <div className="header">
                        <button className="logo"></button>
                        <div className="price_container">
                          <p className="price">
                            {flight.flight.price.total.amount + " руб."}
                          </p>
                          <p>Стоимость для одного взрослого пассажира</p>
                        </div>
                      </div>

                      <div className="airport_container">
                        <p className="airport_text">
                          {
                            flight.flight.legs[0].segments[0].departureCity
                              .caption
                          }{" "}
                          {
                            flight.flight.legs[0].segments[0].departureAirport
                              .caption
                          }
                        </p>
                        <p>&#8594;</p>
                        <p className="airport_text">
                          {flight.flight.legs[0].segments.length === 2
                            ? // flight.flight.legs[0].segments[1].arrivalCity
                              //     .caption + " " +
                              flight.flight.legs[0].segments[1].arrivalAirport
                                .caption
                            : flight.flight.legs[0].segments.length === 1
                            ? //  flight.flight.legs[0].segments[0].arrivalCity
                              //     .caption + " " +
                              flight.flight.legs[0].segments[0].arrivalAirport
                                .caption
                            : " "}
                        </p>
                      </div>

                      <div className="timeDate_container">
                        <p className="timeDate">
                          {this.setDateAndTime(
                            flight.flight.legs[0].segments[0].departureDate
                          )}
                        </p>
                        <p className="timeDate">
                          {flight.flight.legs[0].segments.length === 2
                            ? this.getTimeFromMins(
                                flight.flight.legs[0].segments[0]
                                  .travelDuration +
                                  flight.flight.legs[0].segments[1]
                                    .travelDuration
                              ) + " 1 пересадка"
                            : this.getTimeFromMins(
                                flight.flight.legs[0].segments[0].travelDuration
                              ) + " прямой"}
                        </p>
                        <p className="timeDate">
                          {flight.flight.legs[0].segments.length === 2
                            ? this.setDateAndTime(
                                flight.flight.legs[0].segments[1].arrivalDate
                              )
                            : this.setDateAndTime(
                                flight.flight.legs[0].segments[0].arrivalDate
                              )}
                        </p>
                      </div>
                      <p className="segments"></p>
                      <p className="aircompany">
                        Рейс выполняет: {flight.flight.carrier.caption}
                      </p>

                      <div className="airport_container">
                        <p className="airport_text">
                          {
                            //   flight.flight.legs[1].segments[0].departureCity
                            //      .caption
                          }{" "}
                          {
                            flight.flight.legs[1].segments[0].departureAirport
                              .caption
                          }
                        </p>
                        <p>&#8594;</p>
                        {flight.flight.legs[1].segments.length === 2 ? (
                          <p className="airport_text">
                            {
                              //         flight.flight.legs[1].segments[1].arrivalCity
                              //           .caption
                            }{" "}
                            {
                              flight.flight.legs[1].segments[1].arrivalAirport
                                .caption
                            }
                          </p>
                        ) : (
                          <p className="airport_text">
                            {
                              //       flight.flight.legs[1].segments[0].arrivalCity
                              //          .caption
                            }{" "}
                            {
                              flight.flight.legs[1].segments[0].arrivalAirport
                                .caption
                            }
                          </p>
                        )}
                      </div>
                      <div className="timeDate_container">
                        <p className="timeDate">
                          {this.setDateAndTime(
                            flight.flight.legs[1].segments[0].departureDate
                          )}
                        </p>
                        <p className="timeDate">
                          {flight.flight.legs[1].segments.length === 2
                            ? this.getTimeFromMins(
                                flight.flight.legs[1].segments[0]
                                  .travelDuration +
                                  flight.flight.legs[1].segments[1]
                                    .travelDuration
                              ) + " 1 пересадка"
                            : this.getTimeFromMins(
                                flight.flight.legs[1].segments[0].travelDuration
                              ) + " Прямой"}
                        </p>
                        <p className="timeDate">
                          {flight.flight.legs[1].segments.length === 2
                            ? this.setDateAndTime(
                                flight.flight.legs[1].segments[1].arrivalDate
                              )
                            : this.setDateAndTime(
                                flight.flight.legs[1].segments[0].arrivalDate
                              )}
                        </p>
                      </div>
                      <p className="segments"></p>
                      <p className="aircompany">
                        Рейс выполняет: {flight.flight.carrier.caption}
                      </p>
                      <button className="button">выбрать</button>
                    </div>
                  </>
                );
              }
            })}
            <button className="button" onClick={this.upQuantity.bind(this)}>
              Показать еще 10
            </button>
          </div>
        </div>
      </>
    );
  }
}
