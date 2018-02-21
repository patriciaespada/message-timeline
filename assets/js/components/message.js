'use strict';

angular.module('messageTimelineApp').component('message', {
    templateUrl: '/js/components/message.html',
    bindings: {
        message: '=',
        isReply: '='
    }
});