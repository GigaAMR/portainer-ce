angular.module('portainer.app').controller('AccountController', [
  '$scope',
  '$state',
  'Authentication',
  'UserService',
  'Notifications',
  'SettingsService',
  'StateManager',
  'ThemeManager',
  function ($scope, $state, Authentication, UserService, Notifications, SettingsService, StateManager, ThemeManager) {
    $scope.formValues = {
      currentPassword: '',
      newPassword: '',
      confirmPassword: '',
      userTheme: '',
    };

    $scope.updatePassword = function () {
      UserService.updateUserPassword($scope.userID, $scope.formValues.currentPassword, $scope.formValues.newPassword)
        .then(function success() {
          Notifications.success('成功', '密码已成功更改');
          $state.reload();
        })
        .catch(function error(err) {
          Notifications.error('失败', err, err.msg);
        });
    };

    // Update DOM for theme attribute & LocalStorage
    $scope.setTheme = function (theme) {
      ThemeManager.setTheme(theme);
      StateManager.updateTheme(theme);
    };

    // Rest API Call to update theme with userID in DB
    $scope.updateTheme = function () {
      UserService.updateUserTheme($scope.userID, $scope.formValues.userTheme)
        .then(function success() {
          Notifications.success('成功', '用户主题已成功更新');
          $state.reload();
        })
        .catch(function error(err) {
          Notifications.error('失败', err, err.msg);
        });
    };

    async function initView() {
      $scope.userID = Authentication.getUserDetails().ID;

      const data = await UserService.user($scope.userID);

      $scope.formValues.userTheme = data.Usertheme;
      SettingsService.publicSettings()
        .then(function success(data) {
          $scope.AuthenticationMethod = data.AuthenticationMethod;
        })
        .catch(function error(err) {
          Notifications.error('失败', err, '无法检索应用程序设置');
        });
    }

    initView();
  },
]);
