import React from "react";
import moment from "moment";
import { isMobile } from "react-device-detect";
import { DatePicker, DateRangePicker, SelectPicker } from "rsuite";
const styles = {
  marginBottom: 10,
};
export const DatePickerDate = ({ handleDateChange }) => {
  return (
    <DatePicker
      isoWeek
      block
      style={styles}
      onChange={(value) => {
        handleDateChange(value);
      }}
      format="dd/MM/yyyy"
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
      isoWeek
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
      format="dd/MM/yyyy"
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
export const HourPicker = ({ active, handleHourChange }) => {
  return (
    <DateRangePicker
      isoWeek
      disabled={active}
      block
      style={{ marginBottom: 10 }}
      onChange={(value) => {
        handleHourChange(value);
      }}
      placeholder="Heure*"
      ranges={[]}
      format="HH:mm"
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

export const DatePickerFreeDate = ({ handleDateChange, hour }) => {
  return (
    <DateRangePicker
      isoWeek
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
      format={hour ? "dd/MM/yyyy HH:mm" : "dd/MM/yyyy"}
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
      isoWeek
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
      format="dd/MM/yyyy"
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
      value: parseInt(moment().format("yyyy")),
      label: moment().format("yyyy"),
    },
    {
      value: parseInt(moment().subtract(12, "months").format("yyyy")),
      label: moment().subtract(12, "months").format("yyyy"),
    },
    {
      value: parseInt(moment().subtract(24, "months").format("yyyy")),
      label: moment().subtract(24, "months").format("yyyy"),
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
