import Task from '../Model/Task';

export default async function paginateAggregation(
  page: number = 1,
  limit: number = 10
) {
  try {
    const skip = (page - 1) * limit;

    const [result] = await Task.aggregate([
      {
        $facet: {
          totalCount: [
            {
              $match: {
                $expr: { $gt: [{ $size: '$solutions' }, 1] },
              },
            },
            { $count: 'count' },
          ],
          paginatedResults: [
            {
              $match: {
                $expr: { $gte: [{ $size: '$solutions' }, 1] },
              },
            },
            {
              $lookup: {
                from: 'employees',
                let: { solutionEmployees: '$solutions.employee' },
                pipeline: [
                  {
                    $match: {
                      $expr: {
                        $in: ['$_id', '$$solutionEmployees'],
                      },
                    },
                  },
                ],
                as: 'employeeDetails',
              },
            },
            // Unwind solutions to add serial number
            {
              $unwind: { path: '$solutions', includeArrayIndex: 'arrayIndex' },
            },
            {
              $group: {
                _id: null,
                docs: { $push: '$$ROOT' },
              },
            },
            {
              $unwind: { path: '$docs', includeArrayIndex: 'globalIndex' },
            },
            {
              $addFields: {
                'docs.solutions.srno': { $add: ['$globalIndex', 1] },
              },
            },
            {
              $replaceRoot: { newRoot: '$docs' },
            },
            {
              $group: {
                _id: '$_id',
                solutions: { $push: '$solutions' },
                employeeDetails: { $first: '$employeeDetails' },
                department: { $first: '$department' },
                createdAt: { $first: '$createdAt' },
                // Add other fields you want to preserve
              },
            },
            {
              $addFields: {
                solutions: {
                  $map: {
                    input: '$solutions',
                    as: 'solution',
                    in: {
                      $mergeObjects: [
                        '$$solution',
                        {
                          employee: {
                            $arrayElemAt: [
                              '$employeeDetails',
                              {
                                $indexOfArray: [
                                  '$employeeDetails._id',
                                  '$$solution.employee',
                                ],
                              },
                            ],
                          },
                        },
                      ],
                    },
                  },
                },
              },
            },
            { $sort: { createdAt: -1 } },
            { $skip: skip },
            { $limit: limit },
            {
              $project: {
                employeeDetails: 0,
              },
            },
          ],
        },
      },
    ]);

    const totalCount = result.totalCount[0]?.count || 0;
    const totalPages = Math.ceil(totalCount / limit);

    console.log(result);
    return {
      data: result.paginatedResults,
      pagination: {
        currentPage: page,
        totalPages,
        totalRecords: totalCount,
        hasNextPage: page < totalPages,
        hasPrevPage: page > 1,
        limit,
      },
    };
  } catch (error) {
    throw error;
  }
}
