import { makeAutoObservable, runInAction } from 'mobx';
import ky from 'ky';

export interface User {
  id: number;
  name: string;
  surname: string;
  patronymic: string;
  email: string;
  phone: string;
  department: {
    value: string;
    label: string;
  };
  status: {
    value: string;
    label: string;
  };
  roles: string[];
  administrative_position: {
    value: string;
    type: string;
    label: string;
  };
  medical_position: {
    value: string;
    type: string;
    label: string;
  };
  is_simple_digital_sign_enabled: boolean;
  created_at: number;
  updated_at: number;
  hired_at: number;
  fired_at: number | null;
  email_verified_at: number;
}
export interface Pagination {
  page: number;
  per_page: number;
  total: number;
  last_page: number;
}
export interface UsersResponse {
  message: string;
  data: {
    pagination: {
      page: number;
      per_page: number;
      total: number;
      last_page: number;
    };
    items: User[];
  };
}
export interface FullNameOption {
  name: string;
  chosen: boolean;
  id: string;
}
export interface Position {
  value: string;
  type: string;
  label: string;
}
export interface RoleOption {
  name: string;
  label: string;
}
export interface Department {
  value: string;
  label: string;
}
export interface NewUser {
  name: string;
  surname: string;
  patronymic: string;
  email: string;
  phone: string;
  department: string;
  administrative_position: string;
  medical_position: string;
  is_simple_digital_sign_enabled: boolean;
  hired_at: number;
}

export class UserStore {
  users: User[] = [];
  loading = false;
  error: string | null = null;
  fullNameOptions: FullNameOption[] = [];
  selectedFullNameOptions: FullNameOption[] = [];
  availablePositions: Position[] = [];
  availableRoles: RoleOption[] = [];
  availableDepartments: Department[] = [];

  firedOnly: boolean = false;

  page = 1;
  perPage = 5;
  sortBy = 'id';
  lastPage = 1;

  private splitFullName(fullName: string): { name?: string; surname?: string; patronymic?: string } {
    const parts = fullName.trim().split(/\s+/);
    return {
      surname: parts[0],
      name: parts[1],
      patronymic: parts[2],
    };
  }

  constructor() {
    makeAutoObservable(this);

    const saved = localStorage.getItem('userFilters');
    if (saved) {
      const parsed = JSON.parse(saved);
      this.firedOnly = parsed.filterFiredOnly ?? false;
      this.sortBy = parsed.sortBy ?? 'id';
      this.selectedFullNameOptions = parsed.selectedFullNameOptions ?? [];
    }
  }

  async fetchUsers() {
    this.loading = true;
    this.error = null;

    try {
      const searchParams: Record<string, string> = {
        sort: this.sortBy,
        page: this.page.toString(),
        per_page: this.perPage.toString(),
      };

      const selected = this.selectedFullNameOptions.filter((opt) => opt.chosen);
      selected.forEach((opt, index) => {
        const [surname = '', name = '', patronymic = ''] = opt.name.split(' ');
        if (surname) searchParams[`filter[surname][${index}]`] = surname;
        if (name) searchParams[`filter[name][${index}]`] = name;
        if (patronymic) searchParams[`filter[patronymic][${index}]`] = patronymic;
      });
      console.log(searchParams);

      const response = await ky
        .get('https://api.mock.sb21.ru/api/v1/users', {
          searchParams,
        })
        .json<UsersResponse>();

      runInAction(() => {
        this.users = response.data.items;
        this.lastPage = response.data.pagination.last_page;
      });
    } catch (error: unknown) {
      runInAction(() => {
        if (error instanceof Error) this.error = error.message || 'Ошибка при загрузке пользователей';
      });
    } finally {
      runInAction(() => {
        this.loading = false;
      });
    }
  }

  async fetchFullNames(fullName: string) {
    const filters = this.splitFullName(fullName);
    const searchParams: Record<string, string> = {};

    searchParams['sort'] = this.sortBy;
    searchParams['page'] = '1';
    searchParams['per_page'] = ' 10';
    if (filters.name) searchParams['filter[name]'] = filters.name;
    if (filters.surname) searchParams['filter[surname]'] = filters.surname;
    if (filters.patronymic) searchParams['filter[patronymic]'] = filters.patronymic;

    try {
      const response = await ky
        .get('https://api.mock.sb21.ru/api/v1/users', {
          searchParams,
        })
        .json<UsersResponse>();
      console.log(111);

      runInAction(() => {
        const seen = new Set<string>();

        this.fullNameOptions = response.data.items
          .map((user) => {
            const name = `${user.surname} ${user.name} ${user.patronymic}`;
            if (seen.has(name)) return null;
            seen.add(name);

            const isChosen = this.selectedFullNameOptions.some((opt) => opt.name === name);

            return {
              name,
              chosen: isChosen,
              id: user.id.toString(),
            };
          })
          .filter(Boolean) as FullNameOption[];
      });
    } catch (error: unknown) {
      if (error instanceof Error) console.error('Ошибка при загрузке ФИО:', error.message);
    }
  }

  async fetchAvailablePositions() {
    try {
      const response = await ky.get('https://api.mock.sb21.ru/api/v1/positions').json<{
        message: string;
        data: {
          items: Position[];
        };
      }>();

      runInAction(() => {
        this.availablePositions = response.data.items;
      });
    } catch (error: unknown) {
      if (error instanceof Error) console.error('Ошибка при загрузке позиций:', error.message);
    }
  }
  async fetchAvailableRoles() {
    try {
      const response = await ky.get('https://api.mock.sb21.ru/api/v1/roles').json<{
        data: {
          items: RoleOption[];
        };
      }>();

      runInAction(() => {
        this.availableRoles = response.data.items;
      });
    } catch (error: unknown) {
      if (error instanceof Error) console.error('Ошибка при загрузке ролей:', error.message);
    }
  }
  async fetchAvailableDepartments() {
    try {
      const response = await ky.get('https://api.mock.sb21.ru/api/v1/departments').json<{
        data: { items: Department[] };
      }>();
      runInAction(() => {
        this.availableDepartments = response.data.items;
      });
    } catch (error: unknown) {
      if (error instanceof Error) console.error('Ошибка при загрузке подразделений:', error.message);
    }
  }

  async createUser(user: NewUser) {
    try {
      const response = await ky
        .post('https://api.mock.sb21.ru/api/v1/users', {
          json: user,
        })
        .json();

      return response;
    } catch (error) {
      console.error('Ошибка при создании пользователя:', error);
      throw error;
    }
  }

  async deleteUser(userId: string) {
    try {
      await ky.delete(`https://api.mock.sb21.ru/api/v1/users/${userId}`);
      runInAction(() => {
        this.fetchUsers();
      });
    } catch (error) {
      console.error('Ошибка при увольнении пользователя:', error);
      throw error;
    }
  }

  toggleFiredOnlyFilter() {
    this.firedOnly = !this.firedOnly;
    localStorage.setItem(
      'userFilters',
      JSON.stringify({
        filterFiredOnly: this.firedOnly,
      })
    );
  }

  changeSort(order: string) {
    this.sortBy = order;
    this.fetchUsers();
    localStorage.setItem(
      'userFilters',
      JSON.stringify({
        sortBy: this.sortBy,
      })
    );
  }

  setPage(newPage: number) {
    this.page = newPage;
    this.fetchUsers();
  }

  toggleFullNameOption(id: string) {
    this.fullNameOptions = this.fullNameOptions.map((option) => (option.id === id ? { ...option, chosen: !option.chosen } : option));
    const selected = this.selectedFullNameOptions.find((option) => option.id === id);

    if (selected) {
      this.selectedFullNameOptions = this.selectedFullNameOptions.filter((opt) => opt.id !== id);
    } else {
      const fromSearch = this.fullNameOptions.find((opt) => opt.id === id);
      if (fromSearch) {
        runInAction(() => {
          this.selectedFullNameOptions = [...this.selectedFullNameOptions, fromSearch];
        });
      }
    }

    console.log(this.selectedFullNameOptions);

    this.fetchUsers();
    this.setPage(1);
    this.selectedFullNameOptions.push();
    localStorage.setItem(
      'userFilters',
      JSON.stringify({
        selectedFullNameOptions: this.selectedFullNameOptions,
      })
    );
  }
}

const userStore = new UserStore();
export default userStore;
