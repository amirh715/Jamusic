import { AuthService } from '@/services/AuthService';
import { createRouter, createWebHistory } from '@ionic/vue-router';
import { RouteRecordRaw } from 'vue-router';
import HomeScreen from '../views/Home/HomeScreen.vue';
import SearchScreen from '../views/Home/SearchScreen.vue';
import LibraryScreen from '../views/Library/LibraryScreen.vue';
import LibraryEntityDetailsScreen from '../views/Library/LibraryEntityDetailsScreen.vue';
import PlaylistScreen from '../views/Playlist/PlaylistScreen.vue';
import MyPlaylistsScreen from '../views/Playlist/MyPlaylistsScreen.vue';
import PlaylistDetailsScreen from '../views/Playlist/PlaylistDetailsScreen.vue';
import NewPlaylistScreen from '../views/Playlist/NewPlaylistScreen.vue';
import EditPlaylistScreen from '../views/Playlist/EditPlaylistScreen.vue';
import ReportScreen from '../views/Report/ReportScreen.vue';
import NewReportScreen from '../views/Report/NewReportScreen.vue';
import MyReportsScreen from '../views/Report/MyReportsScreen.vue';
import ProfileScreen from '../views/Profile/ProfileScreen.vue';
import MyProfileInfoScreen from '../views/Profile/MyProfileInfoScreen.vue';
import EditProfileInfoScreen from '../views/Profile/EditProfileInfoScreen.vue';
import AboutScreen from '../views/AboutScreen.vue';
import AuthScreen from '../views/Auth/AuthScreen.vue';
import LoginScreen from '../views/Auth/LoginScreen.vue';
import SignupScreen from '../views/Auth/SignupScreen.vue';
import ForgotPasswordScreen from '../views/Auth/ForgotPasswordScreen.vue';
import ChangePasswordScreen from '../views/Auth/ChangePasswordScreen.vue';
import AccountVerificationScreen from '../views/Auth/AccountVerificationScreen.vue';

const routes: Array<RouteRecordRaw> = [
  {
    path: '/',
    redirect: '/home',
  },
  {
    path: '/home',
    name: 'Home',
    component: HomeScreen,
  },
  {
    path: '/search',
    name: 'Search',
    component: SearchScreen,
  },
  {
    path: '/library/',
    component: LibraryScreen,
    children: [
      {
        path: 'details',
        name: 'LibraryEntityDetails',
        component: LibraryEntityDetailsScreen,
      },
    ],
  },
  {
    path: '/playlist',
    component: PlaylistScreen,
    children: [
      {
        path: 'my',
        name: 'MyPlaylists',
        component: MyPlaylistsScreen,
      },
      {
        path: 'details',
        name: 'PlaylistDetails',
        component: PlaylistDetailsScreen,
      },
      {
        path: 'new',
        name: 'NewPlaylist',
        component: NewPlaylistScreen,
      },
      {
        path: 'edit',
        name: 'EditPlaylist',
        component: EditPlaylistScreen,
      },
    ],
  },
  {
    path: '/report/',
    component: ReportScreen,
    children: [
      {
        path: 'new',
        name: 'NewReport',
        component: NewReportScreen,
      },
      {
        path: 'my',
        name: 'MyReports',
        component: MyReportsScreen,
      },
    ],
  },
  {
    path: '/profile/',
    component: ProfileScreen,
    children: [
      {
        path: 'info',
        name: 'ProfileInfo',
        component: MyProfileInfoScreen,
      },
      {
        path: 'edit',
        name: 'EditProfileInfo',
        component: EditProfileInfoScreen,
      },
    ],
  },
  {
    path: '/about',
    name: 'About',
    component: AboutScreen,
  },
  {
    path: '/auth/',
    component: AuthScreen,
    children: [
      {
        path: 'login',
        name: 'Login',
        component: LoginScreen,
      },
      {
        path: 'signup',
        name: 'Signup',
        component: SignupScreen,
      },
      {
        path: 'forgot-password',
        name: 'ForgotPassword',
        component: ForgotPasswordScreen,
      },
      {
        path: 'change-password',
        name: 'ChangePassword',
        component: ChangePasswordScreen,
      },
      {
        path: 'account-verification',
        name: 'AccountVerification',
        component: AccountVerificationScreen,
      },
    ],
  },
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  const routesAllowedForUnauthenticatedUsers = [
    '/auth/login',
    '/auth/signup',
    '/auth/forgot-password',
    '/auth/account-verification',
  ];
  routesAllowedForUnauthenticatedUsers.some((value) => value === to.path);
  if(AuthService.isAuthenticated()) {
    if(routesAllowedForUnauthenticatedUsers.some((value) => value === to.path))
      return next({ name: 'Home' });
  } else {
    if(!routesAllowedForUnauthenticatedUsers.some((value) => value === to.path))
      return next({ name: 'Signup' });
  }
  next();
})

export default router
