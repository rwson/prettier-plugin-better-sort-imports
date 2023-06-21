import { PrettierOptions } from '../types';
import { preprocessor } from './preprocessor';

export function defaultPreprocessor(code: string, options: any) {
    if (options.filepath?.endsWith('.vue')) return code;
    return preprocessor(code, options);
}