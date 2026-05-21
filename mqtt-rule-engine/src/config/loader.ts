import fs from 'fs';
import { RuleBuilder, Rule } from './builder';
import { RulesConfig } from './types';
import { DEFAULT_CONFIG_PATH, WATCH_INTERVAL_MS } from './constants';

/**
 * Наблюдатель за файлом конфигурации, обеспечивающий горячую перезагрузку.
 */
export class ConfigWatcher {
  private currentContent: string = '';
  private watcher: fs.StatWatcher | null = null;
  private onChangeCallback: (rules: Rule[]) => void = () => {};

  /**
   * Создаёт наблюдатель.
   * @param configPath - путь к файлу конфигурации (по умолчанию './rules.json').
   */
  constructor(private configPath: string = DEFAULT_CONFIG_PATH) {}

  /**
   * Запускает наблюдение за файлом.
   * @param onChange - колбэк, вызываемый при изменении конфигурации (передаёт новые правила).
   */
  start(onChange: (rules: Rule[]) => void): void {
    this.onChangeCallback = onChange;

    // Первоначальная загрузка
    this.loadAndNotify().catch((err) => {
      console.error('Ошибка при начальной загрузке конфигурации:', err);
    });

    // Запуск наблюдения
    this.watcher = fs.watchFile(this.configPath, { interval: WATCH_INTERVAL_MS }, () => {
      this.loadAndNotify().catch((err) => {
        console.error('Ошибка при перезагрузке конфигурации:', err);
      });
    });

    console.log(`Наблюдение за файлом ${this.configPath} запущено`);
  }

  /**
   * Останавливает наблюдение.
   */
  stop(): void {
    if (this.watcher) {
      fs.unwatchFile(this.configPath);
      this.watcher = null;
      console.log('Наблюдение остановлено');
    }
  }

  /**
   * Загружает конфигурацию из файла, парсит и уведомляет, если содержимое изменилось.
   */
  private async loadAndNotify(): Promise<void> {
    try {
      const content = await fs.promises.readFile(this.configPath, 'utf-8');
      if (content === this.currentContent) {
        // Файл не изменился
        return;
      }

      console.log('Обнаружено изменение конфигурации, перезагружаем...');
      const config: RulesConfig = JSON.parse(content);
      const rules = RuleBuilder.buildFromConfig(config);

      this.currentContent = content;
      this.onChangeCallback(rules);
      console.log(`Конфигурация перезагружена, правил: ${rules.length}`);
    } catch (err) {
      console.error('Не удалось загрузить или распарсить конфигурацию:', err);
      // Не прерываем процесс, оставляем старые правила
    }
  }
}