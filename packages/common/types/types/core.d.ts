export interface Paging<T> {
    count: number;
    rows: T[];
}
export declare type uuid = string;
export declare type Path<T> = {
    [P in keyof T]: T[P] extends object ? Path<T[P]> : string;
};
