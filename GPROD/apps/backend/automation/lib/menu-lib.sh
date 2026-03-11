#!/bin/bash

# ===================================================
# 📜 GPROD Menu Library
# ===================================================
# Библиотека для создания интерактивных меню в скриптах bash
#
# Использование:
#   source ./automation/lib/menu-lib.sh

# Подключаем общую библиотеку, если она еще не подключена
if [ -z "$COMMON_NC" ]; then
  SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
  source "$SCRIPT_DIR/common-lib.sh"
fi

# Проверка наличия необходимых утилит
check_menu_deps() {
  if ! command -v tput &> /dev/null; then
    common_print_error "Ошибка: утилита 'tput' не найдена. Установите пакет 'ncurses'."
    return 1
  fi
  return 0
}

# Функция для очистки строки
menu_clear_line() {
  tput el
}

# Функция для перемещения курсора вверх на n строк
menu_cursor_up() {
  tput cuu $1
}

# Функция для перемещения курсора вниз на n строк
menu_cursor_down() {
  tput cud $1
}

# Функция для сохранения позиции курсора
menu_save_cursor() {
  tput sc
}

# Функция для восстановления позиции курсора
menu_restore_cursor() {
  tput rc
}

# Функция для скрытия курсора
menu_hide_cursor() {
  tput civis
}

# Функция для показа курсора
menu_show_cursor() {
  tput cnorm
}

# Функция для отображения меню и выбора опции
# Принимает строку с опциями в формате "value1:label1;value2:label2;..."
# Возвращает выбранное значение
menu_show() {
  local options="$1"
  local default_value="$2"
  
  # Проверка наличия необходимых утилит
  check_menu_deps || return 1
  
  # Разбиваем опции на массив
  IFS=';' read -r -a option_array <<< "$options"
  
  # Определяем количество опций
  local num_options=${#option_array[@]}
  
  # Если нет опций, выходим
  if [ $num_options -eq 0 ]; then
    common_print_error "Нет доступных опций для выбора"
    return 1
  fi
  
  # Определяем индекс опции по умолчанию
  local default_index=0
  for i in $(seq 0 $((num_options-1))); do
    local option_value=$(echo "${option_array[$i]}" | cut -d ':' -f 1)
    if [ "$option_value" = "$default_value" ]; then
      default_index=$i
      break
    fi
  done
  
  # Выводим опции
  for i in $(seq 0 $((num_options-1))); do
    local option_label=$(echo "${option_array[$i]}" | cut -d ':' -f 2)
    if [ $i -eq $default_index ]; then
      echo -e "${COMMON_CYAN}> ${option_label}${COMMON_NC}"
    else
      echo -e "  ${option_label}"
    fi
  done
  
  # Сохраняем позицию курсора
  menu_save_cursor
  
  # Скрываем курсор
  menu_hide_cursor
  
  # Перемещаем курсор вверх на количество опций
  menu_cursor_up $num_options
  
  # Текущий выбранный индекс
  local selected_index=$default_index
  
  # Обработка нажатий клавиш
  while true; do
    # Ждем нажатия клавиши
    read -s -n 1 key
    
    # Обработка нажатия клавиши
    case $key in
      A|k) # Стрелка вверх или k
        if [ $selected_index -gt 0 ]; then
          # Очищаем текущую строку
          menu_clear_line
          # Выводим текущую опцию без выделения
          local option_label=$(echo "${option_array[$selected_index]}" | cut -d ':' -f 2)
          echo -e "  ${option_label}"
          # Перемещаем курсор вверх
          menu_cursor_up 1
          # Обновляем индекс
          selected_index=$((selected_index-1))
          # Очищаем строку
          menu_clear_line
          # Выводим новую опцию с выделением
          option_label=$(echo "${option_array[$selected_index]}" | cut -d ':' -f 2)
          echo -e "${COMMON_CYAN}> ${option_label}${COMMON_NC}"
          # Перемещаем курсор в начало строки
          tput cr
        fi
        ;;
      B|j) # Стрелка вниз или j
        if [ $selected_index -lt $((num_options-1)) ]; then
          # Очищаем текущую строку
          menu_clear_line
          # Выводим текущую опцию без выделения
          local option_label=$(echo "${option_array[$selected_index]}" | cut -d ':' -f 2)
          echo -e "  ${option_label}"
          # Перемещаем курсор вниз
          menu_cursor_down 1
          # Обновляем индекс
          selected_index=$((selected_index+1))
          # Очищаем строку
          menu_clear_line
          # Выводим новую опцию с выделением
          option_label=$(echo "${option_array[$selected_index]}" | cut -d ':' -f 2)
          echo -e "${COMMON_CYAN}> ${option_label}${COMMON_NC}"
          # Перемещаем курсор в начало строки
          tput cr
        fi
        ;;
      '') # Enter
        # Восстанавливаем курсор
        menu_restore_cursor
        # Перемещаем курсор вниз на количество опций
        menu_cursor_down $num_options
        # Показываем курсор
        menu_show_cursor
        # Возвращаем выбранное значение
        echo "$(echo "${option_array[$selected_index]}" | cut -d ':' -f 1)"
        return 0
        ;;
      q|Q) # q или Q для выхода
        # Восстанавливаем курсор
        menu_restore_cursor
        # Перемещаем курсор вниз на количество опций
        menu_cursor_down $num_options
        # Показываем курсор
        menu_show_cursor
        # Возвращаем пустую строку для отмены
        echo ""
        return 1
        ;;
    esac
  done
}

# Экспортируем функции для использования в других скриптах
export -f menu_clear_line menu_cursor_up menu_cursor_down menu_save_cursor menu_restore_cursor
export -f menu_hide_cursor menu_show_cursor menu_show check_menu_deps
