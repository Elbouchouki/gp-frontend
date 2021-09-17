import React from "react";
import moment from "moment";
import { isMobile } from "react-device-detect";
import { DatePicker, DateRangePicker, SelectPicker, Icon } from "rsuite";
const styles = {
  marginBottom: 10,
};
export const DatePickerDate = ({ handleDateChange }) => {
  return (
    <DatePicker
      block
      style={styles}
      onChange={(value) => {
        handleDateChange(value);
      }}
      format="DD/MM/YYYY"
      locale={{
        sunday: "Dim",
        monday: "Lun",
        tuesday: "Mar",
        wednesday: "Mer",
        thursday: "Jeu",
        friday: "Ven",
        saturday: "Sam",
        ok: "OK",
        today: "Aujourd'hui",
        yesterday: "Hier",
        last7Days: "Derniers 7 jours",
      }}
      oneTap
      cleanable={false}
      defaultValue={new Date()}
    />
  );
};
export const DatePickerWeekDate = ({ active, handleDateChange }) => {
  return (
    <DateRangePicker
      showOneCalendar={isMobile}
      cleanable={false}
      block
      style={styles}
      onChange={(value) => {
        handleDateChange(value);
      }}
      oneTap
      // defaultValue={[moment().startOf('week').toDate(),moment().endOf('week').toDate()]}
      hoverRange={active}
      showWeekNumbers={true}
      placeholder="Semaine"
      ranges={[]}
      format="DD/MM/YYYY"
      locale={{
        sunday: "Dim",
        monday: "Lun",
        tuesday: "Mar",
        wednesday: "Mer",
        thursday: "Jeu",
        friday: "Ven",
        saturday: "Sam",
        ok: "OK",
        today: "Aujourd'hui",
        yesterday: "Hier",
        last7Days: "Last 7 days",
      }}
    />
  );
};
export const DatePickerFreeDate = ({ handleDateChange }) => {
  return (
    <DateRangePicker
      showOneCalendar={isMobile}
      cleanable={false}
      block
      style={styles}
      onChange={(value) => {
        handleDateChange(value);
      }}
      placeholder="Date Libre"
      ranges={[
        {
          label: "Ce Mois",
          value: [
            moment().startOf("month").toDate(),
            moment().endOf("month").toDate(),
          ],
        },
        {
          label: "Cette Semaine",
          value: [
            moment().startOf("week").toDate(),
            moment().endOf("week").toDate(),
          ],
        },
        {
          label: "Cette Année",
          value: [
            moment().startOf("year").toDate(),
            moment().endOf("year").toDate(),
          ],
        },
      ]}
      format="DD/MM/YYYY"
      locale={{
        sunday: "Dim",
        monday: "Lun",
        tuesday: "Mar",
        wednesday: "Mer",
        thursday: "Jeu",
        friday: "Ven",
        saturday: "Sam",
        ok: "OK",
        today: "Aujourd'hui",
        yesterday: "Hier",
        last7Days: "Last 7 days",
      }}
    />
  );
};
export const DatePickerMonthDate = ({ active, handleDateChange }) => {
  return (
    <DateRangePicker
      showOneCalendar={isMobile}
      cleanable={false}
      block
      style={styles}
      onChange={(value) => {
        handleDateChange(value);
      }}
      oneTap
      // defaultValue={[moment().startOf('month').toDate(),moment().endOf('month').toDate()]}
      hoverRange={active}
      placeholder="Mois"
      ranges={[]}
      format="DD/MM/YYYY"
      locale={{
        sunday: "Dim",
        monday: "Lun",
        tuesday: "Mar",
        wednesday: "Mer",
        thursday: "Jeu",
        friday: "Ven",
        saturday: "Sam",
        ok: "OK",
        today: "Aujourd'hui",
        yesterday: "Hier",
        last7Days: "Last 7 days",
      }}
    />
  );
};
export const YearSelect = ({ items, handleChange }) => {
  const years = [
    {
      value: parseInt(moment().format("YYYY")),
      label: moment().format("YYYY"),
    },
    {
      value: parseInt(moment().subtract(12, "months").format("YYYY")),
      label: moment().subtract(12, "months").format("YYYY"),
    },
    {
      value: parseInt(moment().subtract(24, "months").format("YYYY")),
      label: moment().subtract(24, "months").format("YYYY"),
    },
  ];
  return (
    <SelectPicker
      block
      placeholder="Anneé"
      data={years}
      style={styles}
      searchable={false}
      onChange={handleChange}
      cleanable={false}
    />
  );
};
