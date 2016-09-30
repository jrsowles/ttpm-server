﻿using System.Collections.Generic;
using System.Linq;
using TinyTwoProjectManager.Data.Infrastructure;
using TinyTwoProjectManager.Data.Repositories;
using TinyTwoProjectManager.Models;

namespace TinyTwoProjectManager.Services
{
    public interface ITaskGroupDisplayOrderService
    {
        void AddTaskToBottomOfTaskGroups(IEnumerable<int> taskGroupIds, int taskId);

        IQueryable<TaskGroupDisplayOrder> GetDisplayOrderForTaskGroup(int taskGroupId);
    }

    public class TaskGroupDisplayOrderService : ServiceBase<TaskGroupDisplayOrder, ITaskGroupDisplayOrderRepository>, ITaskGroupDisplayOrderService
    {
        public TaskGroupDisplayOrderService(ITaskGroupDisplayOrderRepository taskGroupDisplayOrderRepository, IUnitOfWork unitOfWork) : base(taskGroupDisplayOrderRepository, unitOfWork)
        {
        }

        public void AddTaskToBottomOfTaskGroups(IEnumerable<int> taskGroupIds, int taskId)
        {
            // TODO: move this logic to the repository
            foreach (var taskGroupId in taskGroupIds)
            {
                var maxDisplayOrder = GetDisplayOrderForTaskGroup(taskGroupId).Max(tgdo => tgdo.DisplayOrder);

                Repository.Create(new TaskGroupDisplayOrder
                {
                    TaskId = taskId,
                    TaskGroupId = taskGroupId,
                    DisplayOrder = maxDisplayOrder + 1
                });

                Save();
            }
        }

        public IQueryable<TaskGroupDisplayOrder> GetDisplayOrderForTaskGroup(int taskGroupId)
        {
            // TODO: move this logic to the repository
            return Repository.GetMany(tgdo => tgdo.TaskGroupId == taskGroupId);
        }
    }
}