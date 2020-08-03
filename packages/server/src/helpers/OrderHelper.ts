

export type OrderApply<T> = (item: T, index: number, order: number) => Promise<void>

export class OrderHelper<
  T extends Record<K, number>, 
  K extends keyof T>
{
  public ordered: T[];
  public field: K;

  public constructor (ordered: T[], field: K)
  {
    this.ordered = ordered.slice();
    this.field = field;
  }

  public async reorder(fromIndex: number, afterIndex: number, resort: boolean = false, applyOrder?: OrderApply<T>)
  {
    const { ordered, field } = this;
    const moving: T = ordered[fromIndex];

    ordered.splice(fromIndex, 1);

    if (resort)
    {
      ordered.sort((a, b) => a[field] - b[field]);
    }

    const minOrder: number = ordered[0][field];
    const maxOrder: number = ordered[ordered.length - 1][field];

    const toIndex: number = afterIndex + 1;

    const afterOrder: number = afterIndex < 0
      ? minOrder - 1
      : ordered[afterIndex][field];

    const beforeOrder: number = toIndex >= ordered.length
      ? maxOrder + 1
      : ordered[toIndex][field];

    const newOrder: number = (afterOrder + beforeOrder) * 0.5;

    ordered.splice(toIndex, 0, moving);

    moving[field] = newOrder as any;

    const reOrder: boolean = newOrder <= afterOrder 
      || newOrder >= beforeOrder
      || this.hasDuplicateOrders();

    for (let i = 0; i < ordered.length; i++)
    {
      const ordering: T = ordered[i];
      const order = reOrder ? i : ordering[field];
      
      if (applyOrder)
      {
        await applyOrder(ordering, i, order);
      }
      else
      {
        ordering[field] = order as any;
      }
    }
  }

  public hasDuplicateOrders(): boolean
  {
    const { ordered, field } = this;

    for (let i = 1; i < ordered.length; i++)
    {
      if (ordered[i - 1][field] === ordered[i][field])
      {
        return true;
      }
    }

    return false;
  }
}