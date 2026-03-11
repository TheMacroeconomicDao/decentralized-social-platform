import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { Test, TestingModule } from '@nestjs/testing';
import { UserRole, type CreateUserDto } from '../users/dto/create-user.dto';

const userData: CreateUserDto = {
    username: 'user-test',
    email: 'test@email.ru',
    password: 'anashaMoyaDusha',
    roles: [UserRole.USER]
};

const loginData = { username: 'john', password: '123456' };
const expectedUser = { id: 1, ...userData };
const expectedTokens = { access_token: 'fake-access-token', refresh_token: 'fake-refresh-token' };

describe('AuthController', () => {
    let authController: AuthController;
    let authService: AuthService;

    beforeEach(async () => {
        const moduleRef: TestingModule = await Test.createTestingModule({
            controllers: [AuthController],
            providers: [
                {
                    provide: AuthService,
                    useValue: {
                        register: jest.fn(),
                        login: jest.fn(),
                        logout: jest.fn(),
                        refresh: jest.fn(),
                    },
                },
            ],
        }).compile();

        authController = moduleRef.get<AuthController>(AuthController);
        authService = moduleRef.get<AuthService>(AuthService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('сервисы и контроллер определены', () => {
        expect(authController).toBeDefined();
        expect(authService).toBeDefined();
    });

    describe('register', () => {
        it('вызов сервиса register с правильными параметрами', async () => {
            await authController.register(userData);
            expect(authService.register).toHaveBeenCalledWith(userData);
        });

        it('возвращает созданного пользователя', async () => {
            (authService.register as jest.Mock).mockResolvedValue(expectedUser);
            const result = await authController.register(userData);
            expect(result).toEqual(expectedUser);
        });

        it('бросает ошибку при неудачной регистрации', async () => {
            (authService.register as jest.Mock).mockRejectedValue(new Error('Ошибка регистрации'));
            await expect(authController.register(userData)).rejects.toThrow('Ошибка регистрации');
        });
    });

    describe('login', () => {
        it('вызов сервиса login с правильными параметрами', async () => {
            await authController.login(loginData);
            expect(authService.login).toHaveBeenCalledWith(loginData.username, loginData.password);
        });

        it('возвращает access_token и refresh_token', async () => {
            (authService.login as jest.Mock).mockResolvedValue(expectedTokens);
            const result = await authController.login(loginData);
            expect(result).toEqual(expectedTokens);
            expect(result).toHaveProperty('access_token');
            expect(result).toHaveProperty('refresh_token');
        });

        it('бросает ошибку при неправильных данных входа', async () => {
            (authService.login as jest.Mock).mockRejectedValue(new Error('Неверные учетные данные'));
            await expect(authController.login(loginData)).rejects.toThrow('Неверные учетные данные');
        });
    });

    describe('logout', () => {
        const logoutData = { userId: 1, refresh_token: 'refresh_token' };

        it('вызов сервиса logout с правильными параметрами', async () => {
            await authController.logout(logoutData.userId, logoutData.refresh_token);
            expect(authService.logout).toHaveBeenCalledWith(logoutData.userId, logoutData.refresh_token);
        });

        it('обрабатывает ошибку logout', async () => {
            (authService.logout as jest.Mock).mockRejectedValue(new Error('Ошибка выхода'));
            await expect(authController.logout(logoutData.userId, logoutData.refresh_token)).rejects.toThrow('Ошибка выхода');
        });
    });

    describe('refresh', () => {
        const refreshToken = 'some-refresh-token';
        const expectedRefreshResult = { access_token: 'new-access-token' };

        it('вызов сервиса refresh с правильным токеном', async () => {
            await authController.refresh(refreshToken);
            expect(authService.refresh).toHaveBeenCalledWith(refreshToken);
        });

        it('возвращает новый access_token', async () => {
            (authService.refresh as jest.Mock).mockResolvedValue(expectedRefreshResult);
            const result = await authController.refresh(refreshToken);
            expect(result).toEqual(expectedRefreshResult);
            expect(result).toHaveProperty('access_token');
        });

        it('бросает ошибку при невалидном refresh_token', async () => {
            (authService.refresh as jest.Mock).mockRejectedValue(new Error('Неверный refresh token'));
            await expect(authController.refresh(refreshToken)).rejects.toThrow('Неверный refresh token');
        });
    });
});
