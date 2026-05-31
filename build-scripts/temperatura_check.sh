#!/bin/sh
NORMAL_THRESHOLD=85
REBOOT_THRESHOLD=100

for card in $(lsusb | awk '{print $6}' | sort | uniq); do
  case "$card" in
    "0bda:8812" | "0bda:881a" | "0b05:17d2" | "2357:0101" | "2604:0012") driver=88XXau ;;
    "0bda:a81a") driver=8812eu ;;
    "0bda:f72b" | "0bda:b733") driver=8733bu ;;
  esac
done

wifi_adapter="$driver"
echo "Знайдено адаптер: $wifi_adapter"

while true; do
  vtx_temp=$(ipcinfo --temp)
  vtx_int=$(echo "$vtx_temp" | cut -d. -f1)
  adapter_temp=0

  if [ "$wifi_adapter" = "8733bu" ]; then
    adapter_temp=$(grep -o 'temperature: [0-9]*' /proc/net/rtl8733bu/wlan0/thermal_state | awk '{print $2}')
  elif [ "$wifi_adapter" = "88XXau" ]; then
    echo "Температура 88XXau ще не реалізована."
  elif [ "$wifi_adapter" = "8812eu" ]; then
    if [ -f /proc/net/rtl88x2eu/wlan0/thermal_state ]; then
      adapter_temp=$(grep -o 'temperature: [0-9]*' /proc/net/rtl88x2eu/wlan0/thermal_state | awk '{print $2}' | sort -n | tail -1)
    else
      echo "Файл температури не знайдено."
    fi
  fi

  [ -z "$adapter_temp" ] && adapter_temp=0

  echo "VTX: ${vtx_temp}°C, Адаптер: ${adapter_temp}°C"

  if [ "$adapter_temp" -gt "$vtx_int" ]; then
    max_temp=$adapter_temp
  else
    max_temp=$vtx_int
  fi

  if [ "$max_temp" -lt "$NORMAL_THRESHOLD" ]; then
    echo "Все добре"
  elif [ "$max_temp" -lt "$REBOOT_THRESHOLD" ]; then
    echo "Попередження: Висока температура" > /tmp/MSPOSD.msg
  else
    echo "Перезапуск через перегрів..." > /tmp/MSPOSD.msg
    sleep 15
    reboot
  fi

  sleep 5
done
