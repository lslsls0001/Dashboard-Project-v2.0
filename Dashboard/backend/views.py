from django.http.request import HttpHeaders
from django.http.response import HttpResponse
from django.shortcuts import render
from django.urls.resolvers import get_resolver
from django.views.generic.base import View
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from rest_framework import generics, serializers

from .serializers import RoomSerializer
from .models import Room

from rest_framework.response import Response

import json
from django.http import JsonResponse

import vertica_python as vp
from .config import Parameters

# Create your views here.


class RoomView(generics.ListAPIView):
    queryset = Room.objects.all()
    serializer_class = RoomSerializer

'''
    set up the parameters connects to the database
'''
def connectDatabase():
    conn_info = {'host': Parameters.host, 'port': Parameters.port, 'database': Parameters.database, 'user': Parameters.user, 'password': Parameters.password, 'read_timeout': Parameters.read_timeout, 'unicode_error': Parameters.unicode_error, 'ssl': Parameters.ssl}
    conn = vp.connect(**conn_info)
    curs = conn.cursor()
    return curs, conn

'''
    when you have SQL statement ready, this function is to run this SQL and return the data.
'''
def SqlInquireDatabase(parameters, dbInstance, dbConnection):

    res = ""

    try:
        tableToSearch = parameters[0]
        selectedParameter = parameters[1]

        sqlSummary = "SELECT " + selectedParameter + " FROM (SELECT DISTINCT " + selectedParameter + " from " + tableToSearch

        sqlTemp = ""

        if (len(parameters) > 2):
            sqlSummary = sqlSummary + " where "

        for index_1 in range(len(parameters)):

            if (index_1 == 0 or index_1 == 1):
                continue

            item = parameters[index_1]

            parameterStr = ""

            if ("MFG_AREA_NAME" in item):
                for index_2 in range(len(item["MFG_AREA_NAME"])):
                    if (index_2 == len(item["MFG_AREA_NAME"]) - 1):
                        parameterStr = parameterStr + "(MFG_AREA_NAME='" + item["MFG_AREA_NAME"][index_2] + "')"
                    else:
                        parameterStr = parameterStr + "(MFG_AREA_NAME='" + item["MFG_AREA_NAME"][index_2] + "') or "
                if (index_1 == len(parameters) - 1):
                    parameterStr = "(" + parameterStr + ")"
                else:
                    parameterStr = "(" + parameterStr + ") and "
            elif ("DATA_TYPE" in item):
                for index_2 in range(len(item["DATA_TYPE"])):
                    if (index_2 == len(item["DATA_TYPE"]) - 1):
                        parameterStr = parameterStr + "(DATA_TYPE='" + item["DATA_TYPE"][index_2] + "')"
                    else:
                        parameterStr = parameterStr + "(DATA_TYPE='" + item["DATA_TYPE"][index_2] + "') or "
                if (index_1 == len(parameters) - 1):
                    parameterStr = "(" + parameterStr + ")"
                else:
                    parameterStr = "(" + parameterStr + ") and "
            elif ("TECHNOLOGY" in item):
                for index_2 in range(len(item["TECHNOLOGY"])):
                    if (index_2 == len(item["TECHNOLOGY"]) - 1):
                        parameterStr = parameterStr + "(TECHNOLOGY='" + item["TECHNOLOGY"][index_2] + "')"
                    else:
                        parameterStr = parameterStr + "(TECHNOLOGY='" + item["TECHNOLOGY"][index_2] + "') or "
                if (index_1 == len(parameters) - 1):
                    parameterStr = "(" + parameterStr + ")"
                else:
                    parameterStr = "(" + parameterStr + ") and "
            elif ("PRODUCT_FAMILY" in item):
                for index_2 in range(len(item["PRODUCT_FAMILY"])):
                    if (index_2 == len(item["PRODUCT_FAMILY"]) - 1):
                        parameterStr = parameterStr + "(PRODUCT_FAMILY='" + item["PRODUCT_FAMILY"][index_2] + "')"
                    else:
                        parameterStr = parameterStr + "(PRODUCT_FAMILY='" + item["PRODUCT_FAMILY"][index_2] + "') or "
                if (index_1 == len(parameters) - 1):
                    parameterStr = "(" + parameterStr + ")"
                else:
                    parameterStr = "(" + parameterStr + ") and "
            elif ("PRODUCT" in item):
                for index_2 in range(len(item["PRODUCT"])):
                    if (index_2 == len(item["PRODUCT"]) - 1):
                        parameterStr = parameterStr + "(PRODUCT='" + item["PRODUCT"][index_2] + "')"
                    else:
                        parameterStr = parameterStr + "(PRODUCT='" + item["PRODUCT"][index_2] + "') or "
                if (index_1 == len(parameters) - 1):
                    parameterStr = "(" + parameterStr + ")"
                else:
                    parameterStr = "(" + parameterStr + ") and "
            elif ("LOT_TYPE" in item):
                for index_2 in range(len(item["LOT_TYPE"])):
                    if (index_2 == len(item["LOT_TYPE"]) - 1):
                        parameterStr = parameterStr + "(LOT_TYPE='" + item["LOT_TYPE"][index_2] + "')"
                    else:
                        parameterStr = parameterStr + "(LOT_TYPE='" + item["LOT_TYPE"][index_2] + "') or "
                if (index_1 == len(parameters) - 1):
                    parameterStr = "(" + parameterStr + ")"
                else:
                    parameterStr = "(" + parameterStr + ") and "
            elif ("PROJECT" in item):
                for index_2 in range(len(item["PROJECT"])):
                    if (index_2 == len(item["PROJECT"]) - 1):
                        parameterStr = parameterStr + "(PROJECT='" + item["PROJECT"][index_2] + "')"
                    else:
                        parameterStr = parameterStr + "(PROJECT='" + item["PROJECT"][index_2] + "') or "
                if (index_1 == len(parameters) - 1):
                    parameterStr = "(" + parameterStr + ")"
                else:
                    parameterStr = "(" + parameterStr + ") and "
            elif ("MCN" in item):
                for index_2 in range(len(item["MCN"])):
                    if (index_2 == len(item["MCN"]) - 1):
                        parameterStr = parameterStr + "(MCN='" + item["MCN"][index_2] + "')"
                    else:
                        parameterStr = parameterStr + "(MCN='" + item["MCN"][index_2] + "') or "
                if (index_1 == len(parameters) - 1):
                    parameterStr = "(" + parameterStr + ")"
                else:
                    parameterStr = "(" + parameterStr + ") and "
            elif ("PRODUCT_MASK_SET" in item):
                for index_2 in range(len(item["PRODUCT_MASK_SET"])):
                    if (index_2 == len(item["PRODUCT_MASK_SET"]) - 1):
                        parameterStr = parameterStr + "(PRODUCT_MASK_SET='" + item["PRODUCT_MASK_SET"][index_2] + "')"
                    else:
                        parameterStr = parameterStr + "(PRODUCT_MASK_SET='" + item["PRODUCT_MASK_SET"][
                            index_2] + "') or "
                if (index_1 == len(parameters) - 1):
                    parameterStr = "(" + parameterStr + ")"
                else:
                    parameterStr = "(" + parameterStr + ") and "
            elif ("PART_ID" in item):
                for index_2 in range(len(item["PART_ID"])):
                    if (index_2 == len(item["PART_ID"]) - 1):
                        parameterStr = parameterStr + "(PART_ID='" + item["PART_ID"][index_2] + "')"
                    else:
                        parameterStr = parameterStr + "(PART_ID='" + item["PART_ID"][index_2] + "') or "
                if (index_1 == len(parameters) - 1):
                    parameterStr = "(" + parameterStr + ")"
                else:
                    parameterStr = "(" + parameterStr + ") and "
            elif ("PROCESS_AREA" in item):
                for index_2 in range(len(item["PROCESS_AREA"])):
                    if (index_2 == len(item["PROCESS_AREA"]) - 1):
                        parameterStr = parameterStr + "(PROCESS_AREA='" + item["PROCESS_AREA"][index_2] + "')"
                    else:
                        parameterStr = parameterStr + "(PROCESS_AREA='" + item["PROCESS_AREA"][index_2] + "') or "
                if (index_1 == len(parameters) - 1):
                    parameterStr = "(" + parameterStr + ")"
                else:
                    parameterStr = "(" + parameterStr + ") and "
            elif ("OPERATION" in item):
                for index_2 in range(len(item["OPERATION"])):
                    if (index_2 == len(item["OPERATION"]) - 1):
                        parameterStr = parameterStr + "(OPERATION='" + item["OPERATION"][index_2] + "')"
                    else:
                        parameterStr = parameterStr + "(OPERATION='" + item["OPERATION"][index_2] + "') or "
                if (index_1 == len(parameters) - 1):
                    parameterStr = "(" + parameterStr + ")"
                else:
                    parameterStr = "(" + parameterStr + ") and "
            elif ("SUB_OPERATION" in item):
                for index_2 in range(len(item["SUB_OPERATION"])):
                    if (index_2 == len(item["SUB_OPERATION"]) - 1):
                        parameterStr = parameterStr + "(SUB_OPERATION='" + item["SUB_OPERATION"][index_2] + "')"
                    else:
                        parameterStr = parameterStr + "(SUB_OPERATION='" + item["SUB_OPERATION"][index_2] + "') or "
                if (index_1 == len(parameters) - 1):
                    parameterStr = "(" + parameterStr + ")"
                else:
                    parameterStr = "(" + parameterStr + ") and "
            elif ("EQUIP" in item):
                for index_2 in range(len(item["EQUIP"])):
                    if (index_2 == len(item["EQUIP"]) - 1):
                        parameterStr = parameterStr + "(EQUIP='" + item["EQUIP"][index_2] + "')"
                    else:
                        parameterStr = parameterStr + "(EQUIP='" + item["EQUIP"][index_2] + "') or "
                if (index_1 == len(parameters) - 1):
                    parameterStr = "(" + parameterStr + ")"
                else:
                    parameterStr = "(" + parameterStr + ") and "
            else:
                continue

            sqlTemp = sqlTemp + parameterStr

        sqlSummary = sqlSummary + sqlTemp + ") tmpT order by " + selectedParameter

        print(sqlSummary)

        try:
            dbInstance.execute(sqlSummary)
            res = dbInstance.fetchall()
        except Exception as e:
            print('Connection or execution failed:', e)

        dbInstance.execute("COMMIT")

    except Exception as e:
        print(e)
    finally:
        dbInstance.close()
        dbConnection.close()

    return res
'''
    summarize all the parameters and form a new list to include everything, 
'''
def initDataParameters(
    tableName, targetSelection, TECHNOLOGY, 
    MFG_AREA_NAME, DATA_TYPE, PRODUCT_FAMILY, 
    PRODUCT, LOT_TYPE, PROJECT, MCN, 
    PRODUCT_MASK_SET, PRODUCT_ID, PROCESS_AREA, 
    OPERATION, SUB_OPERATION, EQUIP
    ):

    str = []
    str.append(tableName)
    str.append(targetSelection)

    if(len(TECHNOLOGY)!=0):
        technologyArray = []
        for index in range(len(TECHNOLOGY)):
            technologyArray.append(TECHNOLOGY[index]['value'])
        technologyDict = {}
        technologyDict['TECHNOLOGY'] = technologyArray
        str.append(technologyDict)
    
    if(len(MFG_AREA_NAME)!=0):
        mfgAreaNameArray = []
        for index in range(len(MFG_AREA_NAME)):
            mfgAreaNameArray.append(MFG_AREA_NAME[index]['value'])
        mfgAreaNameDict = {}
        mfgAreaNameDict['MFG_AREA_NAME'] = mfgAreaNameArray
        str.append(mfgAreaNameDict)

    if(len(DATA_TYPE)!=0):
        dataTypeArray = []
        for index in range(len(DATA_TYPE)):
            dataTypeArray.append(DATA_TYPE[index]['value'])
        dataTypeDict = {}
        dataTypeDict['DATA_TYPE'] = dataTypeArray
        str.append(dataTypeDict)

    if(len(PRODUCT_FAMILY)!=0):
        productFamilyArray = []
        for index in range(len(PRODUCT_FAMILY)):
            productFamilyArray.append(PRODUCT_FAMILY[index]['value'])
        productFamilyDict = {}
        productFamilyDict['PRODUCT_FAMILY'] = productFamilyArray
        str.append(productFamilyDict)
    
    if(len(PRODUCT)!=0):
        productArray = []
        for index in range(len(PRODUCT)):
            productArray.append(PRODUCT[index]['value'])
        productDict = {}
        productDict['PRODUCT'] = productArray
        str.append(productDict)
    
    if(len(LOT_TYPE)!=0):
        lotTypeArray = []
        for index in range(len(LOT_TYPE)):
            lotTypeArray.append(LOT_TYPE[index]['value'])
        lotTypeDict = {}
        lotTypeDict['LOT_TYPE'] = lotTypeArray
        str.append(lotTypeDict)
    
    if(len(PROJECT)!=0):
        projectArray = []
        for index in range(len(PROJECT)):
            projectArray.append(PROJECT[index]['value'])
        projectDict = {}
        projectDict['PROJECT'] = projectArray
        str.append(projectDict)

    if(len(MCN)!=0):
        mcnArray = []
        for index in range(len(MCN)):
            mcnArray.append(MCN[index]['value'])
        mcnDict = {}
        mcnDict['MCN'] = mcnArray
        str.append(mcnDict)
    
    if(len(PRODUCT_MASK_SET)!=0):
        productMaskSetArray = []
        for index in range(len(PRODUCT_MASK_SET)):
            productMaskSetArray.append(PRODUCT_MASK_SET[index]['value'])
        productMaskSetDict = {}
        productMaskSetDict['PRODUCT_MASK_SET'] = productMaskSetArray
        str.append(productMaskSetDict)
    
    if(len(PRODUCT_ID)!=0):
        productIdArray = []
        for index in range(len(PRODUCT_ID)):
            productIdArray.append(PRODUCT_ID[index]['value'])
        productIdDict = {}
        productIdDict['PRODUCT_ID'] = productIdArray
        str.append(productIdDict)

    if(len(PROCESS_AREA)!=0):
        processAreaArray = []
        for index in range(len(PROCESS_AREA)):
            processAreaArray.append(PROCESS_AREA[index]['value'])
        processAreaDict = {}
        processAreaDict['PROCESS_AREA'] = processAreaArray
        str.append(processAreaDict)
    
    if(len(OPERATION)!=0):
        operationArray = []
        for index in range(len(OPERATION)):
            operationArray.append(OPERATION[index]['value'])
        operationDict = {}
        operationDict['OPERATION'] = operationArray
        str.append(operationDict)
    
    if(len(SUB_OPERATION)!=0):
        subOperationArray = []
        for index in range(len(SUB_OPERATION)):
            subOperationArray.append(SUB_OPERATION[index]['value'])
        subOperationDict = {}
        subOperationDict['SUB_OPERATION'] = subOperationArray
        str.append(subOperationDict)
    
    if(len(EQUIP)!=0):
        equipArray = []
        for index in range(len(EQUIP)):
            equipArray.append(EQUIP[index]['value'])
        equipDict = {}
        equipDict['EQUIP'] = equipArray
        str.append(equipDict)
    
    return str
'''
    this is the function to retrieve the parameters from request to store in the local variable, then other function can use these parameters values.
'''
def extractParmeters(request):
    TITLE = json.loads(request.GET.get('TITLE'))
    TECHNOLOGY = json.loads(request.GET.get('TECHNOLOGY'))
    MFG_AREA_NAME = json.loads(request.GET.get('MFG_AREA_NAME'))
    DATA_TYPE = json.loads(request.GET.get('DATA_TYPE'))
    PRODUCT_FAMILY = json.loads(request.GET.get('PRODUCT_FAMILY'))
    PRODUCT = json.loads(request.GET.get('PRODUCT'))
    LOT_TYPE = json.loads(request.GET.get('LOT_TYPE'))
    PROJECT = json.loads(request.GET.get('PROJECT'))
    MCN = json.loads(request.GET.get('MCN'))
    PRODUCT_MASK_SET = json.loads(request.GET.get('PRODUCT_MASK_SET'))
    PRODUCT_ID = json.loads(request.GET.get('PRODUCT_ID'))
    PROCESS_AREA = json.loads(request.GET.get('PROCESS_AREA'))
    OPERATION = json.loads(request.GET.get('OPERATION'))
    SUB_OPERATION = json.loads(request.GET.get('SUB_OPERATION'))
    EQUIP = json.loads(request.GET.get('EQUIP'))

    return TITLE, TECHNOLOGY, MFG_AREA_NAME, DATA_TYPE, PRODUCT_FAMILY, PRODUCT, LOT_TYPE, PROJECT, MCN, PRODUCT_MASK_SET, PRODUCT_ID, PROCESS_AREA, OPERATION, SUB_OPERATION, EQUIP

'''
    sqlStatement = initDataParameters('METADATA.YDI_META_GDR_V', 'TECHNOLOGY', 
        TECHNOLOGY, MFG_AREA_NAME, DATA_TYPE, PRODUCT_FAMILY, PRODUCT, LOT_TYPE, 
        PROJECT, MCN, PRODUCT_MASK_SET, PRODUCT_ID, PROCESS_AREA, OPERATION, SUB_OPERATION, EQUIP)
'''
'''
    this function will summarize all other functions and run them in a sequence
'''
@csrf_exempt
def MenuListSelection(request):
    TITLE, TECHNOLOGY, MFG_AREA_NAME, DATA_TYPE, PRODUCT_FAMILY, PRODUCT, LOT_TYPE, PROJECT, MCN, PRODUCT_MASK_SET, PRODUCT_ID, PROCESS_AREA, OPERATION, SUB_OPERATION, EQUIP = extractParmeters(request)
    
    sqlStatement = ""

    if(TITLE == "TECHNOLOGY"):
        sqlStatement = initDataParameters('METADATA.YDI_META_GDR_V', 'TECHNOLOGY', [], MFG_AREA_NAME, DATA_TYPE, [], [], [], [], [], [], [], [], [], [], [])
    elif(TITLE == "MFG_AREA_NAME"):
        sqlStatement = initDataParameters('METADATA.YDI_META_GDR_V', 'MFG_AREA_NAME', TECHNOLOGY, [], DATA_TYPE, [], [], [], [], [], [], [], [], [], [], [])
    elif(TITLE == "DATA_TYPE"):
        sqlStatement = initDataParameters('METADATA.YDI_META_GDR_V', 'DATA_TYPE', TECHNOLOGY, MFG_AREA_NAME, [], [], [], [], [], [], [], [], [], [], [], [])
    elif(TITLE == "PRODUCT_FAMILY"):
        sqlStatement = initDataParameters('METADATA.YDI_META_GDR_V', 'PRODUCT_FAMILY', TECHNOLOGY, MFG_AREA_NAME, DATA_TYPE, [], [], [], [], [], [], [], [], [], [], [])
    elif(TITLE == "PRODUCT"):
        sqlStatement = initDataParameters('METADATA.YDI_META_GDR_V', 'PRODUCT', TECHNOLOGY, MFG_AREA_NAME, DATA_TYPE, PRODUCT_FAMILY, [], [], [], [], [], [], [], [], [], [])
    elif(TITLE == "LOT_TYPE"):
        sqlStatement = initDataParameters('METADATA.YDI_META_GDR_V', 'LOT_TYPE', TECHNOLOGY, MFG_AREA_NAME, DATA_TYPE, PRODUCT_FAMILY, PRODUCT, [], [], [], [], [], [], [], [], [])
    elif(TITLE == "PROJECT"):
        sqlStatement = initDataParameters('METADATA.YDI_META_GDR_V', 'PROJECT', TECHNOLOGY, MFG_AREA_NAME, DATA_TYPE, PRODUCT_FAMILY, PRODUCT, LOT_TYPE, [], [], [], [], [], [], [], [])
    elif(TITLE == "MCN"):
        sqlStatement = initDataParameters('METADATA.YDI_META_GDR_V', 'MCN', TECHNOLOGY, MFG_AREA_NAME, DATA_TYPE, PRODUCT_FAMILY, PRODUCT, LOT_TYPE, PROJECT, [], [], [], [], [], [], [])
    elif(TITLE == "PRODUCT_MASK_SET"):
        sqlStatement = initDataParameters('METADATA.YDI_META_GDR_V', 'PRODUCT_MASK_SET', TECHNOLOGY, MFG_AREA_NAME, DATA_TYPE, PRODUCT_FAMILY, PRODUCT, LOT_TYPE, PROJECT, MCN, [], [], [], [], [], [])
    elif(TITLE == "PRODUCT_ID"):
        sqlStatement = initDataParameters('METADATA.YDI_META_GDR_V', 'PRODUCT_ID', TECHNOLOGY, MFG_AREA_NAME, DATA_TYPE, PRODUCT_FAMILY, PRODUCT, LOT_TYPE, PROJECT, MCN, PRODUCT_MASK_SET, [], [], [], [], [])
    elif(TITLE == "PROCESS_AREA"):
        sqlStatement = initDataParameters('METADATA.YDI_META_GDR_V', 'PROCESS_AREA', TECHNOLOGY, MFG_AREA_NAME, DATA_TYPE, PRODUCT_FAMILY, PRODUCT, LOT_TYPE, PROJECT, MCN, PRODUCT_MASK_SET, PRODUCT_ID, [], [], [], [])
    elif(TITLE == "OPERATION"):
        sqlStatement = initDataParameters('METADATA.YDI_META_GDR_V', 'OPERATION', TECHNOLOGY, MFG_AREA_NAME, DATA_TYPE, PRODUCT_FAMILY, PRODUCT, LOT_TYPE, PROJECT, MCN, PRODUCT_MASK_SET, PRODUCT_ID, PROCESS_AREA, [], [], [])
    elif(TITLE == "SUB_OPERATION"):
        sqlStatement = initDataParameters('METADATA.YDI_META_GDR_V', 'SUB_OPERATION', TECHNOLOGY, MFG_AREA_NAME, DATA_TYPE, PRODUCT_FAMILY, PRODUCT, LOT_TYPE, PROJECT, MCN, PRODUCT_MASK_SET, PRODUCT_ID, PROCESS_AREA, OPERATION, [], [])
    elif(TITLE == "EQUIPMENT"):
        sqlStatement = initDataParameters('METADATA.YDI_META_GDR_V', 'EQUIP', TECHNOLOGY, MFG_AREA_NAME, DATA_TYPE, PRODUCT_FAMILY, PRODUCT, LOT_TYPE, PROJECT, MCN, PRODUCT_MASK_SET, PRODUCT_ID, PROCESS_AREA, OPERATION, SUB_OPERATION, [])    
    else:
        sqlStatement = "None"
        return

    print(sqlStatement)

    dbInstance, dbConnection = connectDatabase()
    menuList = SqlInquireDatabase(sqlStatement, dbInstance, dbConnection)
    print(menuList)

    menuListFinal = []
    for index in range(len(menuList)):
        dict = {}
        dict['value'] = menuList[index][0]
        dict['label'] = menuList[index][0]
        menuListFinal.append(dict)

    #return HttpResponse(menuListFinal)
    return JsonResponse(menuListFinal, safe=False)






"""
PRECONDITION:
    - sqlStatement is the query to be sent to the database.
    - dbInstance and dbConnection are for the database connection
POSTCONDITION:
"""
def getLotId_inquireDatabase(sqlStatement, dbInstance, dbConnection):
    res = ""

    try:
        try:
            dbInstance.execute(sqlStatement)
            res = dbInstance.fetchall()
        except Exception as e:
            print('Connection or execution failed:', e)

        dbInstance.execute("COMMIT")

    except Exception as e:
        print(e)
    finally:
        dbInstance.close()
        dbConnection.close()

    return res

"""
getLodId_generateSqlStatementDate
PRECONDITION:
    - filterCategories is a list of dictionaries containing the name of each dropdown category selected and its values
    - tableName is the name of the table in the database
    - CALENDAR_OPTION_DATE is the dictionary containing the start date/time and end date/time
POSTCONDITION:
    Returns an SQL statement in the form of a string to query the database. For example, if the following parameters were selected:
        - MFG_AREA_NAME: mfg_1, mfg_2
        - DATA_TYPE: dt_1
        - PRODUCT_FAMILIY: pd_1, pd_2
    The SQL statement returned by the function would be:
        SELECT DISTINCT LOT from METADATA.YDI_META_V_LOT_HISTORY where ((MFG_AREA_NAME in ('mfg_1', 'mfg_2')) and 
        (DATA_TYPE='dt_1') and (PRODUCT_FAMILY in ('pd_1', 'pd_2'))) and 
        (DATE_STEP_STARTED between To_TIMESTAMP('01/10/2021 11:59:00 PM', 'MM/DD/YYYY HH12:MI:SS PM') 
        AND To_TIMESTAMP('11/04/2021 07:30:00 AM', 'MM/DD/YYYY HH12:MI:SS PM')) order by LOT 
"""
def getLotId_generateSqlStatementDate(filterCategories, tableName, CALENDAR_OPTION_DATE):

    # store all dates/times in arrays
    startDate = CALENDAR_OPTION_DATE['startDate']
    startTime = CALENDAR_OPTION_DATE['startTime']
    endDate = CALENDAR_OPTION_DATE['endDate']
    endTime = CALENDAR_OPTION_DATE['endTime']

    # get individual year/month/day and hour/minutes
    startDateYear = startDate[0]
    startDateMonth = startDate[1]
    startDateDay = startDate[2]
    startTimeHour = startTime[0]
    startTimeMinute = startTime[1]
    endDateYear = endDate[0]
    endDateMonth = endDate[1]
    endDateDay = endDate[2]
    endTimeHour = endTime[0]
    endTimeMinute = endTime[1]

    # initialize date/time formats (part of sql statement)
    # create the strings for start date/time string
    # '10/18/2021 10:23:00 AM'
    startDateTimeFormat = 'MM/DD/YYYY HH12:MI:SS '
    if startTimeHour < 12:
        startDateTimeFormat += 'AM'
    else:
        startDateTimeFormat += 'PM'
    startDateTimeString = ''
    startTimeHour12 = 0
    if startTimeHour == 0 or startTimeHour == 12:
        startTimeHour12 = 12
    elif startTimeHour < 12:
        startTimeHour12 = startTimeHour
    else:
        startTimeHour12 = startTimeHour - 12

    if startDateMonth < 10:
        startDateTimeString += '0'
    startDateTimeString += str(startDateMonth) + '/'
    if startDateDay < 10:
        startDateTimeString += '0'
    startDateTimeString += str(startDateDay) + '/'
    startDateTimeString += str(startDateYear) + ' '
    if startTimeHour12 < 10:
        startDateTimeString += '0'
    startDateTimeString += str(startTimeHour12) + ':'
    if startTimeMinute < 10:
        startDateTimeString += '0'
    startDateTimeString += str(startTimeMinute) + ':'
    startDateTimeString += '00 '
    if startTimeHour < 12:
        startDateTimeString += 'AM'
    else:
        startDateTimeString += 'PM'


    # create the strings for end date/time string
    # '10/18/2021 10:23:00 AM'
    endDateTimeFormat = 'MM/DD/YYYY HH12:MI:SS '
    if endTimeHour < 12:
        endDateTimeFormat += 'AM'
    else:
        endDateTimeFormat += 'PM'
    endDateTimeString = ''
    endTimeHour12 = 0
    if endTimeHour == 0 or endTimeHour == 12:
        endTimeHour12 = 12
    elif endTimeHour < 12:
        endTimeHour12 = endTimeHour
    else:
        endTimeHour12 = endTimeHour - 12

    if endDateMonth < 10:
        endDateTimeString += '0'
    endDateTimeString += str(endDateMonth) + '/'
    if endDateDay < 10:
        endDateTimeString += '0'
    endDateTimeString += str(endDateDay) + '/'
    endDateTimeString += str(endDateYear) + ' '
    if endTimeHour12 < 10:
        endDateTimeString += '0'
    endDateTimeString += str(endTimeHour12) + ':'
    if endTimeMinute < 10:
        endDateTimeString += '0'
    endDateTimeString += str(endTimeMinute) + ':'
    endDateTimeString += '00 '
    if endTimeHour < 12:
        endDateTimeString += 'AM'
    else:
        endDateTimeString += 'PM'
    
    sqlStatement = "SELECT DISTINCT LOT from " + tableName + " where "
    combinedDateAndTimeStrings = "(DATE_STEP_STARTED between To_TIMESTAMP('" + startDateTimeString + "', '" + startDateTimeFormat + "') AND "
    combinedDateAndTimeStrings += "To_TIMESTAMP('" + endDateTimeString + "', '" + startDateTimeFormat + "')) order by LOT"

    if len(filterCategories) > 0:
        sqlStatement += "("
        for i in range(len(filterCategories)):
            sqlStatement += "("
            filterCategoryKey = list(filterCategories[i].keys())        # ['DATA_TYPE']
            filterCategoryValues = list(filterCategories[i].values())   # [['date_type_1', 'data_type_2']]
            filterCategoryValues = filterCategoryValues[0]              #['data_type_1', 'data_type_2']
            if len(filterCategoryValues) == 1:
                sqlStatement += filterCategoryKey[0] + "=" + "'" + filterCategoryValues[0] + "'"
            elif len(filterCategoryValues) > 1:
                sqlStatement += filterCategoryKey[0] + " in ("
                for j in range(len(filterCategoryValues)):
                    sqlStatement += "'" + filterCategoryValues[j] + "'"
                    if j < len(filterCategoryValues) - 1:
                        sqlStatement += ", "
                    else:
                        sqlStatement += ")"
            sqlStatement += ")"
            if i < len(filterCategories) - 1:
                sqlStatement += " and "
            
        sqlStatement += ") and "

    sqlStatement += combinedDateAndTimeStrings


    return sqlStatement


"""
getLotId_generateSqlStatementLastNDaysLots
PRECONDITION:
    - filterCategories is a list of dictionaries containing the name of each dropdown category selected and its values
    - tableName is the name of the table in the database
    - CALENDAR_OPTION_LAST_N_DAYS_LOTS is the dictionary containing the whether last days or lots was selected,
      and the totals for each
POSTCONDITION:
    Returns an SQL statement in the form of a string to query the database. For example, if the following parameters were selected:
        - MFG_AREA_NAME: mfg_1, mfg_2
        - DATA_TYPE: dt_1
        - PRODUCT_FAMILIY: pd_1, pd_2
    The SQL statement returned by the function would be:
        SELECT DISTINCT LOT from METADATA.YDI_META_V_LOT_HISTORY where ((MFG_AREA_NAME in ('mfg_1', 'mfg_2')) and 
        (DATA_TYPE='dt_1') and (PRODUCT_FAMILY in ('pd_1', 'pd_2'))) and 
        (DATE_STEP_STARTED between To_TIMESTAMP('01/10/2021 11:59:00 PM', 'MM/DD/YYYY HH12:MI:SS PM') 
        AND To_TIMESTAMP('11/04/2021 07:30:00 AM', 'MM/DD/YYYY HH12:MI:SS PM')) order by LOT 
"""
def getLotId_generateSqlStatementLastNDaysLots(filterCategories, tableName, CALENDAR_OPTION_LAST_N_DAYS_LOTS):
    sqlStatement = ""
    radioButton = CALENDAR_OPTION_LAST_N_DAYS_LOTS['radioButton']
    lastDaysTotal = CALENDAR_OPTION_LAST_N_DAYS_LOTS['lastDaysTotal']
    lastLotsTotal = CALENDAR_OPTION_LAST_N_DAYS_LOTS['lastLotsTotal']

    if radioButton == 'Last Days':
        sqlStatement += "select distinct LOT from (SELECT DISTINCT LOT, DATE_STEP_STARTED from " + tableName + " where "
        sqlLastDays = "DATE_STEP_STARTED > GetDate() - " + str(lastDaysTotal) + " order by DATE_STEP_STARTED ASC ) subselect order by LOT"

        if len(filterCategories) > 0:
            sqlStatement += "("
            for i in range(len(filterCategories)):
                sqlStatement += "("
                filterCategoryKey = list(filterCategories[i].keys())        # ['DATA_TYPE']
                filterCategoryValues = list(filterCategories[i].values())   # [['date_type_1', 'data_type_2']]
                filterCategoryValues = filterCategoryValues[0]              #['data_type_1', 'data_type_2']
                if len(filterCategoryValues) == 1:
                    sqlStatement += filterCategoryKey[0] + "=" + "'" + filterCategoryValues[0] + "'"
                elif len(filterCategoryValues) > 1:
                    sqlStatement += filterCategoryKey[0] + " in ("
                    for j in range(len(filterCategoryValues)):
                        sqlStatement += "'" + filterCategoryValues[j] + "'"
                        if j < len(filterCategoryValues) - 1:
                            sqlStatement += ", "
                        else:
                            sqlStatement += ")"
                sqlStatement += ")"
                if i < len(filterCategories) - 1:
                    sqlStatement += " and "
                
            sqlStatement += ") and "
        sqlStatement += sqlLastDays

    elif radioButton == 'Last Lots':
        sqlStatement += "select LOT from (SELECT LOT from (select LOT, max(DATE_STEP_STARTED) as step_date from " + tableName + " where "
        sqlLastLots = "group by LOT order by step_date DESC limit " + str(lastLotsTotal) + ") subquery) subT order by LOT"
        if len(filterCategories) > 0:
            sqlStatement += "("
            for i in range(len(filterCategories)):
                sqlStatement += "("
                filterCategoryKey = list(filterCategories[i].keys())        # ['DATA_TYPE']
                filterCategoryValues = list(filterCategories[i].values())   # [['date_type_1', 'data_type_2']]
                filterCategoryValues = filterCategoryValues[0]              #['data_type_1', 'data_type_2']
                if len(filterCategoryValues) == 1:
                    sqlStatement += filterCategoryKey[0] + "=" + "'" + filterCategoryValues[0] + "'"
                elif len(filterCategoryValues) > 1:
                    sqlStatement += filterCategoryKey[0] + " in ("
                    for j in range(len(filterCategoryValues)):
                        sqlStatement += "'" + filterCategoryValues[j] + "'"
                        if j < len(filterCategoryValues) - 1:
                            sqlStatement += ", "
                        else:
                            sqlStatement += ")"
                sqlStatement += ")"
                if i < len(filterCategories) - 1:
                    sqlStatement += " and "
                
            sqlStatement += ") "
        sqlStatement += sqlLastLots


    return sqlStatement


"""
getLotId_generateSqlStatementLastNDaysLots
PRECONDITION:
    - filterCategories is a list of dictionaries containing the name of each dropdown category selected and its values
    - tableName is the name of the table in the database
    - CALENDAR_OPTION_CALENDAR_RULE is the dictionary containing the necessary information
POSTCONDITION:
    Stub function - waiting to hear back from Kevin.
"""
def getLotId_generateSqlStatementCalendarRule(filterCategories, tableName, CALENDAR_OPTION_CALENDAR_RULE):
    pass


"""
PRECONDITION:
    The "Get Lot ID" button has been clicked on the control panel with the dropdown items selected and the calendar options selected
POSTCONDITION:
    Returns all the parameters as stringified JSON objects.
    This function is called in getLotId_handleRequest
"""
def getLotId_extractParameters(request):
    TECHNOLOGY = json.loads(request.GET.get('TECHNOLOGY'))
    MFG_AREA_NAME = json.loads(request.GET.get('MFG_AREA_NAME'))
    DATA_TYPE = json.loads(request.GET.get('DATA_TYPE'))
    PRODUCT_FAMILY = json.loads(request.GET.get('PRODUCT_FAMILY'))
    PRODUCT = json.loads(request.GET.get('PRODUCT'))
    LOT_TYPE = json.loads(request.GET.get('LOT_TYPE'))
    PROJECT = json.loads(request.GET.get('PROJECT'))
    MCN = json.loads(request.GET.get('MCN'))
    PRODUCT_MASK_SET = json.loads(request.GET.get('PRODUCT_MASK_SET'))
    PRODUCT_ID = json.loads(request.GET.get('PRODUCT_ID'))
    PROCESS_AREA = json.loads(request.GET.get('PROCESS_AREA'))
    OPERATION = json.loads(request.GET.get('OPERATION'))
    SUB_OPERATION = json.loads(request.GET.get('SUB_OPERATION'))
    EQUIP = json.loads(request.GET.get('EQUIP'))
    CALENDAR_OPTION = json.loads(request.GET.get('CALENDAR_OPTION'))
    CALENDAR_OPTION_DATE = json.loads(request.GET.get('CALENDAR_OPTION_DATE'))
    CALENDAR_OPTION_LAST_N_DAYS_LOTS = json.loads(request.GET.get('CALENDAR_OPTION_LAST_N_DAYS_LOTS'))
    CALENDAR_OPTION_CALENDAR_RULE = json.loads(request.GET.get('CALENDAR_OPTION_CALENDAR_RULE'))
    

    return TECHNOLOGY, MFG_AREA_NAME, DATA_TYPE, PRODUCT_FAMILY, PRODUCT, LOT_TYPE, PROJECT, MCN, PRODUCT_MASK_SET, PRODUCT_ID, PROCESS_AREA, OPERATION, SUB_OPERATION, EQUIP, CALENDAR_OPTION, CALENDAR_OPTION_DATE, CALENDAR_OPTION_LAST_N_DAYS_LOTS, CALENDAR_OPTION_CALENDAR_RULE


"""
PRECONDITION:
    The getLotId_extractParameters function has been called to get the dropdown item selected and calendar options selected from the front end. 
POSTCONDITION:
    Returns a string containing all of the parameters information

"""
def getLotId_getSelectedFilterCategories(TECHNOLOGY, MFG_AREA_NAME, DATA_TYPE,
    PRODUCT_FAMILY, PRODUCT, LOT_TYPE,
    PROJECT, MCN, PRODUCT_MASK_SET, 
    PRODUCT_ID, PROCESS_AREA, OPERATION, 
    SUB_OPERATION, EQUIP):

    str = []

    if(len(TECHNOLOGY)!=0):
        technologyArray = []
        for index in range(len(TECHNOLOGY)):
            technologyArray.append(TECHNOLOGY[index]['value'])
        technologyDict = {}
        technologyDict['TECHNOLOGY'] = technologyArray
        str.append(technologyDict)
    
    if(len(MFG_AREA_NAME)!=0):
        mfgAreaNameArray = []
        for index in range(len(MFG_AREA_NAME)):
            mfgAreaNameArray.append(MFG_AREA_NAME[index]['value'])
        mfgAreaNameDict = {}
        mfgAreaNameDict['MFG_AREA_NAME'] = mfgAreaNameArray
        str.append(mfgAreaNameDict)

    if(len(DATA_TYPE)!=0):
        dataTypeArray = []
        for index in range(len(DATA_TYPE)):
            dataTypeArray.append(DATA_TYPE[index]['value'])
        dataTypeDict = {}
        dataTypeDict['DATA_TYPE'] = dataTypeArray
        str.append(dataTypeDict)

    if(len(PRODUCT_FAMILY)!=0):
        productFamilyArray = []
        for index in range(len(PRODUCT_FAMILY)):
            productFamilyArray.append(PRODUCT_FAMILY[index]['value'])
        productFamilyDict = {}
        productFamilyDict['PRODUCT_FAMILY'] = productFamilyArray
        str.append(productFamilyDict)
    
    if(len(PRODUCT)!=0):
        productArray = []
        for index in range(len(PRODUCT)):
            productArray.append(PRODUCT[index]['value'])
        productDict = {}
        productDict['PRODUCT'] = productArray
        str.append(productDict)
    
    if(len(LOT_TYPE)!=0):
        lotTypeArray = []
        for index in range(len(LOT_TYPE)):
            lotTypeArray.append(LOT_TYPE[index]['value'])
        lotTypeDict = {}
        lotTypeDict['LOT_TYPE'] = lotTypeArray
        str.append(lotTypeDict)
    
    if(len(PROJECT)!=0):
        projectArray = []
        for index in range(len(PROJECT)):
            projectArray.append(PROJECT[index]['value'])
        projectDict = {}
        projectDict['PROJECT'] = projectArray
        str.append(projectDict)

    if(len(MCN)!=0):
        mcnArray = []
        for index in range(len(MCN)):
            mcnArray.append(MCN[index]['value'])
        mcnDict = {}
        mcnDict['MCN'] = mcnArray
        str.append(mcnDict)
    
    if(len(PRODUCT_MASK_SET)!=0):
        productMaskSetArray = []
        for index in range(len(PRODUCT_MASK_SET)):
            productMaskSetArray.append(PRODUCT_MASK_SET[index]['value'])
        productMaskSetDict = {}
        productMaskSetDict['PRODUCT_MASK_SET'] = productMaskSetArray
        str.append(productMaskSetDict)
    
    if(len(PRODUCT_ID)!=0):
        productIdArray = []
        for index in range(len(PRODUCT_ID)):
            productIdArray.append(PRODUCT_ID[index]['value'])
        productIdDict = {}
        productIdDict['PRODUCT_ID'] = productIdArray
        str.append(productIdDict)

    if(len(PROCESS_AREA)!=0):
        processAreaArray = []
        for index in range(len(PROCESS_AREA)):
            processAreaArray.append(PROCESS_AREA[index]['value'])
        processAreaDict = {}
        processAreaDict['PROCESS_AREA'] = processAreaArray
        str.append(processAreaDict)
    
    if(len(OPERATION)!=0):
        operationArray = []
        for index in range(len(OPERATION)):
            operationArray.append(OPERATION[index]['value'])
        operationDict = {}
        operationDict['OPERATION'] = operationArray
        str.append(operationDict)
    
    if(len(SUB_OPERATION)!=0):
        subOperationArray = []
        for index in range(len(SUB_OPERATION)):
            subOperationArray.append(SUB_OPERATION[index]['value'])
        subOperationDict = {}
        subOperationDict['SUB_OPERATION'] = subOperationArray
        str.append(subOperationDict)
    
    if(len(EQUIP)!=0):
        equipArray = []
        for index in range(len(EQUIP)):
            equipArray.append(EQUIP[index]['value'])
        equipDict = {}
        equipDict['EQUIP'] = equipArray
        str.append(equipDict)
    
    return str


@csrf_exempt
def getLotId_handleRequest(request):
    TECHNOLOGY, MFG_AREA_NAME, DATA_TYPE, PRODUCT_FAMILY, PRODUCT, LOT_TYPE, PROJECT, MCN, PRODUCT_MASK_SET, PRODUCT_ID, PROCESS_AREA, OPERATION, SUB_OPERATION, EQUIP, CALENDAR_OPTION, CALENDAR_OPTION_DATE, CALENDAR_OPTION_LAST_N_DAYS_LOTS, CALENDAR_OPTION_CALENDAR_RULE = getLotId_extractParameters(request)
    
    sqlStatement = ""
    tableName = "METADATA.YDI_META_V_LOT_HISTORY"
    filterCategories = getLotId_getSelectedFilterCategories(TECHNOLOGY, MFG_AREA_NAME, DATA_TYPE, PRODUCT_FAMILY, PRODUCT, LOT_TYPE, PROJECT, MCN, PRODUCT_MASK_SET, PRODUCT_ID, PROCESS_AREA, OPERATION, SUB_OPERATION, EQUIP)
    
    if CALENDAR_OPTION == "Date":
        sqlStatement = getLotId_generateSqlStatementDate(filterCategories, tableName, CALENDAR_OPTION_DATE)
        pass
    elif CALENDAR_OPTION == "Last n Days/Lots":
        sqlStatement = getLotId_generateSqlStatementLastNDaysLots(filterCategories, tableName, CALENDAR_OPTION_LAST_N_DAYS_LOTS)
        pass
    elif CALENDAR_OPTION == "Calendar Rule":
        sqlStatement = getLotId_generateSqlStatementCalendarRule(filterCategories, tableName, CALENDAR_OPTION_CALENDAR_RULE)
        pass
    else:
        sqlStatement = "None"
        return

    print('')
    print(sqlStatement)
    print('')
    dbInstance, dbConnection = connectDatabase()
    lots = getLotId_inquireDatabase(sqlStatement, dbInstance, dbConnection)
    print('\nLots:')
    print(lots)
    print('\n')

    lotListFinal = []
    for index in range(len(lots)):
        dict = {}
        dict['value'] = lots[index][0]
        dict['label'] = lots[index][0]
        lotListFinal.append(dict)

    print('Lot List Final')
    print(lotListFinal)
    print('')

    return JsonResponse(lotListFinal, safe=False)





'''
1. Select MODULE_ID from METADATA.YDI_META_GDR_LOT_MODULE where (Lot in ('4111433','D00000327'))    *get the module id

2. Select MODULE_NAME from METADATA.YDI_META_GDR_CONFIG where (MODULE_ID in ('1','3','4'))       *return the data type that can be selected

3. Select MODULE_NAME from METADATA.YDI_META_GDR_CONFIG    *return all data type list
'''

@csrf_exempt
def DataTypeSelection(request):

    # this part of code is to extract the module name list
    dbInstance, dbConnection = connectDatabase()

    sqlModuleName = "Select MODULE_NAME from METADATA.YDI_META_GDR_CONFIG"

    ModuleNameList = ""

    try:
        dbInstance.execute(sqlModuleName)
        ModuleNameList = dbInstance.fetchall()
        dbInstance.execute("COMMIT")
    except Exception as e:
        print('Connection or execution failed:', e)
    finally:
        dbInstance.close()
        dbConnection.close()
    
    print(ModuleNameList)

    
    # this part of code is to extract the module id list based on the selected lot id.
    dbInstance, dbConnection = connectDatabase()

    selectedLotId = json.loads(request.GET.get('SELECTED_LOT_ID'))

    print(selectedLotId)

    selectedAggregationLevel = json.loads(request.GET.get('SELECTED_AGGREGATION_LEVEL'))

    if(len(selectedLotId)!=0):
        sqlLotIdList = "Select DISTINCT MODULE_ID from METADATA.YDI_META_GDR_LOT_MODULE where (Lot in ("

        for index in range(len(selectedLotId)):
            if index == len(selectedLotId) - 1:
                sqlLotIdList = sqlLotIdList + "'" + selectedLotId[index] + "'"
            else:
                sqlLotIdList = sqlLotIdList + "'" + selectedLotId[index] + "',"
        
        if(selectedAggregationLevel == "Lot"):
            sqlLotIdList = sqlLotIdList + ") and ( LOT_ENABLED = 1))"
        elif(selectedAggregationLevel == "Wafer"):
            sqlLotIdList = sqlLotIdList + ") and ( WAFER_ENABLED = 1))"
        elif(selectedAggregationLevel == "Unit"):
            sqlLotIdList = sqlLotIdList + ") and ( UNIT_ENABLED = 1))"
        else:
            sqlLotIdList = sqlLotIdList + "))"

        print(sqlLotIdList)

        ModuleIdList = ""

        try:
            dbInstance.execute(sqlLotIdList)
            ModuleIdList = dbInstance.fetchall()
            dbInstance.execute("COMMIT")
        except Exception as e:
            print('Connection or execution failed:', e)
        finally:
            dbInstance.close()
            dbConnection.close()
        
        print(ModuleIdList)


        # this part of code is to extract the MODULE_NAME list to be selected.
        dbInstance, dbConnection = connectDatabase()

        sqlSelectedModuleName = "Select MODULE_NAME from METADATA.YDI_META_GDR_CONFIG where (MODULE_ID in "

        tempModuleId = "("
        for index in range(len(ModuleIdList)):
            if index == len(ModuleIdList) - 1:
                tempModuleId = tempModuleId + "'"+ str(ModuleIdList[index][0]) +"')"
            else:
                tempModuleId = tempModuleId + "'"+ str(ModuleIdList[index][0]) +"',"


        sqlSelectedModuleName = sqlSelectedModuleName + tempModuleId + ")"

        selectedModuleName = ""

        try:
            dbInstance.execute(sqlSelectedModuleName)
            selectedModuleName = dbInstance.fetchall()
            dbInstance.execute("COMMIT")
        except Exception as e:
            print('Connection or execution failed:', e)
        finally:
            dbInstance.close()
            dbConnection.close()
        
        print(selectedModuleName)

        dataTypeSummary= {}
    
        for index in range(len(ModuleNameList)):
            flag = 1
            for index_2 in range(len(selectedModuleName)):
                if ModuleNameList[index][0] == selectedModuleName[index_2][0]:
                    dataTypeSummary[ModuleNameList[index][0]] = "enabled"
                    flag = 0
                    break
                else:
                    continue
            if(flag == 1):
                dataTypeSummary[ModuleNameList[index][0]] = "disabled"

        print(dataTypeSummary)
    else:
        dataTypeSummary = {}
    
        for index in range(len(ModuleNameList)):
            dataTypeSummary[ModuleNameList[index][0]] = "disabled"

        print(dataTypeSummary)


    #return HttpResponse(menuListFinal)
    return JsonResponse(dataTypeSummary, safe=False)



'''
1. extract the menu list of data type operations
'''

@csrf_exempt
def DataTypeOperationMenuList(request):
    # this part of code is to extract the module name list
    title = json.loads(request.GET.get('TITLE'))
    print("title: " + title)

    selectedLotId = json.loads(request.GET.get('SELECTED_LOT_ID'))
    selectedRetrieveParameter = json.loads(request.GET.get('SELECTED_RETRIEVE_PARAMETER'))
    selectedDataTypeClicked = json.loads(request.GET.get('SELECTED_DATA_TYPE_CLICKED'))
    dataTypeWPOperationSelectedValue = json.loads(request.GET.get('SELECTED_DATA_TYPE_WP_OPERATION'))
    dataTypePCMOperationSelectedValue = json.loads(request.GET.get('SELECTED_DATA_TYPE_PCM_OPERATION'))

    selectedTechnology = json.loads(request.GET.get('TECHNOLOGY'))
    selectedMfgAreaName = json.loads(request.GET.get('MFG_AREA_NAME'))
    selectedProductFamily = json.loads(request.GET.get('PRODUCT_FAMILY'))
    selectedProduct = json.loads(request.GET.get('PRODUCT'))

    if selectedDataTypeClicked == "WP":
        if selectedRetrieveParameter == "Lot":
            sqlSelectedDataTypeOperationsMenuList = "select distinct operation from METADATA.YDI_GDR_PARAM_SORT_PARAM where (LOT in "
            sqlSelectedDataTypeParameters = 'select distinct "PARAMETER" from METADATA.YDI_GDR_PARAM_SORT_PARAM where (LOT in '

            lotIdCollection = "("
            for index in range(len(selectedLotId)):
                if index == len(selectedLotId)-1:
                    lotIdCollection = lotIdCollection + "'" + selectedLotId[index] + "')"
                else:
                    lotIdCollection = lotIdCollection + "'" + selectedLotId[index] + "',"
            sqlSelectedDataTypeOperationsMenuList = sqlSelectedDataTypeOperationsMenuList + lotIdCollection + ") order by operation"

            if dataTypeWPOperationSelectedValue != "All":
                sqlSelectedDataTypeParameters = sqlSelectedDataTypeParameters + lotIdCollection + ") and (OPERATION in ('" + dataTypeWPOperationSelectedValue + "')) order by \"PARAMETER\""
            else:
                sqlSelectedDataTypeParameters = sqlSelectedDataTypeParameters + lotIdCollection + ') order by "PARAMETER"'


            #print(sqlSelectedDataTypeOperationsMenuList)
            #print(sqlSelectedDataTypeParameters)

        if selectedRetrieveParameter == "Product":
            sqlSelectedDataTypeOperationsMenuList = "select distinct operation from METADATA.YDI_META_GDR_PARAM where "
            sqlSelectedDataTypeParameters = 'select distinct "PARAMETER" from METADATA.YDI_META_GDR_PARAM where '

            
            keywordSummary = []
            keywordSummaryString = ""
            
            technologyString = ""
            mfgAreaNameString = ""
            productFamilyString = ""
            productString = ""

            if(len(selectedTechnology)!=0):
                for index in range(len(selectedTechnology)):
                    if(index == len(selectedTechnology) - 1):
                        technologyString = technologyString + "(TECHNOLOGY='" + selectedTechnology[index]['value'] + "')"
                    else:
                        technologyString = technologyString + "(TECHNOLOGY='" + selectedTechnology[index]['value'] + "') or "
                technologyString = "(" + technologyString + ")"
                keywordSummary.append(technologyString)

            if(len(selectedMfgAreaName)!=0):
                for index in range(len(selectedMfgAreaName)):
                    if(index == len(selectedMfgAreaName) - 1):
                        mfgAreaNameString = mfgAreaNameString + "(MFG_AREA_NAME='" + selectedMfgAreaName[index]['value'] + "')"
                    else:
                        mfgAreaNameString = mfgAreaNameString + "(MFG_AREA_NAME='" + selectedMfgAreaName[index]['value'] + "') or "
                keywordSummary.append(mfgAreaNameString)

            if(len(selectedProductFamily)!=0):
                for index in range(len(selectedProductFamily)):
                    if(index == len(selectedProductFamily) - 1):
                        productFamilyString = productFamilyString + "(PRODUCT_FAMILY='" + selectedProductFamily[index]['value'] + "')"
                    else:
                        productFamilyString = productFamilyString + "(PRODUCT_FAMILY='" + selectedProductFamily[index]['value'] + "') or "
                keywordSummary.append(productFamilyString)
            
            if(len(selectedProduct)!=0):
                for index in range(len(selectedProduct)):
                    if(index == len(selectedProduct) - 1):
                        productString = productString + "(PRODUCT='" + selectedProduct[index]['value'] + "')"
                    else:
                        productString = productString + "(PRODUCT='" + selectedProduct[index]['value'] + "') or "
                keywordSummary.append(productString)
            
            for index in range(len(keywordSummary)):
                if(len(keywordSummary[index])==0):
                    continue
                else:
                    if index == len(keywordSummary) -1:
                        keywordSummaryString = keywordSummaryString + keywordSummary[index]
                    else:
                        keywordSummaryString = keywordSummaryString + keywordSummary[index] + " and "

            if len(keywordSummaryString)!=0:
                keywordSummaryString = keywordSummaryString + " and DATA_TYPE = 'SORT_PARAM'"
            else:
                keywordSummaryString = keywordSummaryString + " DATA_TYPE = 'SORT_PARAM'"

            sqlSelectedDataTypeOperationsMenuList = sqlSelectedDataTypeOperationsMenuList + keywordSummaryString + " order by OPERATION"

            if dataTypeWPOperationSelectedValue != "All":
                sqlSelectedDataTypeParameters = sqlSelectedDataTypeParameters + keywordSummaryString + " and (OPERATION in ('" + dataTypeWPOperationSelectedValue + "')) order by \"PARAMETER\""
            else:
                sqlSelectedDataTypeParameters = sqlSelectedDataTypeParameters + keywordSummaryString + ' order by "PARAMETER"'

            #print(sqlSelectedDataTypeOperationsMenuList)
            #print(sqlSelectedDataTypeParameters)

    elif selectedDataTypeClicked == "PCM":
        if selectedRetrieveParameter == "Lot":
            sqlSelectedDataTypeOperationsMenuList = "select distinct operation from METADATA.YDI_GDR_PARAM_FAB_ETEST where (LOT in "
            sqlSelectedDataTypeParameters = 'select distinct "PARAMETER" from METADATA.YDI_GDR_PARAM_FAB_ETEST where (LOT in '

            lotIdCollection = "("
            for index in range(len(selectedLotId)):
                if index == len(selectedLotId)-1:
                    lotIdCollection = lotIdCollection + "'" + selectedLotId[index] + "')"
                else:
                    lotIdCollection = lotIdCollection + "'" + selectedLotId[index] + "',"
            sqlSelectedDataTypeOperationsMenuList = sqlSelectedDataTypeOperationsMenuList + lotIdCollection + ") order by operation"

            if dataTypePCMOperationSelectedValue != "All":
                sqlSelectedDataTypeParameters = sqlSelectedDataTypeParameters + lotIdCollection + ") and (OPERATION in ('" + dataTypePCMOperationSelectedValue + "')) order by \"PARAMETER\""
            else:
                sqlSelectedDataTypeParameters = sqlSelectedDataTypeParameters + lotIdCollection + ') order by "PARAMETER"'


            #print(sqlSelectedDataTypeOperationsMenuList)
            #print(sqlSelectedDataTypeParameters)

        if selectedRetrieveParameter == "Product":
            sqlSelectedDataTypeOperationsMenuList = "select distinct operation from METADATA.YDI_META_GDR_PARAM where "
            sqlSelectedDataTypeParameters = 'select distinct "PARAMETER" from METADATA.YDI_META_GDR_PARAM where '

            
            keywordSummary = []
            keywordSummaryString = ""
            
            technologyString = ""
            mfgAreaNameString = ""
            productFamilyString = ""
            productString = ""

            if(len(selectedTechnology)!=0):
                for index in range(len(selectedTechnology)):
                    if(index == len(selectedTechnology) - 1):
                        technologyString = technologyString + "(TECHNOLOGY='" + selectedTechnology[index]['value'] + "')"
                    else:
                        technologyString = technologyString + "(TECHNOLOGY='" + selectedTechnology[index]['value'] + "') or "
                technologyString = "(" + technologyString + ")"
                keywordSummary.append(technologyString)

            if(len(selectedMfgAreaName)!=0):
                for index in range(len(selectedMfgAreaName)):
                    if(index == len(selectedMfgAreaName) - 1):
                        mfgAreaNameString = mfgAreaNameString + "(MFG_AREA_NAME='" + selectedMfgAreaName[index]['value'] + "')"
                    else:
                        mfgAreaNameString = mfgAreaNameString + "(MFG_AREA_NAME='" + selectedMfgAreaName[index]['value'] + "') or "
                keywordSummary.append(mfgAreaNameString)

            if(len(selectedProductFamily)!=0):
                for index in range(len(selectedProductFamily)):
                    if(index == len(selectedProductFamily) - 1):
                        productFamilyString = productFamilyString + "(PRODUCT_FAMILY='" + selectedProductFamily[index]['value'] + "')"
                    else:
                        productFamilyString = productFamilyString + "(PRODUCT_FAMILY='" + selectedProductFamily[index]['value'] + "') or "
                keywordSummary.append(productFamilyString)
            
            if(len(selectedProduct)!=0):
                for index in range(len(selectedProduct)):
                    if(index == len(selectedProduct) - 1):
                        productString = productString + "(PRODUCT='" + selectedProduct[index]['value'] + "')"
                    else:
                        productString = productString + "(PRODUCT='" + selectedProduct[index]['value'] + "') or "
                keywordSummary.append(productString)
            
            for index in range(len(keywordSummary)):
                if(len(keywordSummary[index])==0):
                    continue
                else:
                    if index == len(keywordSummary) -1:
                        keywordSummaryString = keywordSummaryString + keywordSummary[index]
                    else:
                        keywordSummaryString = keywordSummaryString + keywordSummary[index] + " and "

            if len(keywordSummaryString)!=0:
                keywordSummaryString = keywordSummaryString + " and DATA_TYPE = 'ETEST'"
            else:
                keywordSummaryString = keywordSummaryString + " DATA_TYPE = 'ETEST'"

            sqlSelectedDataTypeOperationsMenuList = sqlSelectedDataTypeOperationsMenuList + keywordSummaryString + " order by OPERATION"

            if dataTypePCMOperationSelectedValue != "All":
                sqlSelectedDataTypeParameters = sqlSelectedDataTypeParameters + keywordSummaryString + " and (OPERATION in ('" + dataTypePCMOperationSelectedValue + "')) order by \"PARAMETER\""
            else:
                sqlSelectedDataTypeParameters = sqlSelectedDataTypeParameters + keywordSummaryString + ' order by "PARAMETER"'

            #print(sqlSelectedDataTypeOperationsMenuList)
            #print(sqlSelectedDataTypeParameters)  
          
    elif selectedDataTypeClicked == "WIP":
        if selectedRetrieveParameter == "Lot":
            sqlSelectedDataTypeOperationsMenuList = "select distinct operation from METADATA.YDI_GDR_DATA_TYPE_WIP where (LOT in "

            lotIdCollection = "("
            for index in range(len(selectedLotId)):
                if index == len(selectedLotId)-1:
                    lotIdCollection = lotIdCollection + "'" + selectedLotId[index] + "')"
                else:
                    lotIdCollection = lotIdCollection + "'" + selectedLotId[index] + "',"
            
            sqlSelectedDataTypeOperationsMenuList = sqlSelectedDataTypeOperationsMenuList + lotIdCollection + ") order by operation"

            #print(sqlSelectedDataTypeOperationsMenuList)

        if selectedRetrieveParameter == "Product":
            sqlSelectedDataTypeOperationsMenuList = "select distinct operation from METADATA.YDI_META_GDR_DATA_TYPE where "
        
            keywordSummary = []
            keywordSummaryString = ""
            
            technologyString = ""
            mfgAreaNameString = ""
            productFamilyString = ""
            productString = ""

            if(len(selectedTechnology)!=0):
                for index in range(len(selectedTechnology)):
                    if(index == len(selectedTechnology) - 1):
                        technologyString = technologyString + "(TECHNOLOGY='" + selectedTechnology[index]['value'] + "')"
                    else:
                        technologyString = technologyString + "(TECHNOLOGY='" + selectedTechnology[index]['value'] + "') or "
                technologyString = "(" + technologyString + ")"
                keywordSummary.append(technologyString)

            if(len(selectedMfgAreaName)!=0):
                for index in range(len(selectedMfgAreaName)):
                    if(index == len(selectedMfgAreaName) - 1):
                        mfgAreaNameString = mfgAreaNameString + "(MFG_AREA_NAME='" + selectedMfgAreaName[index]['value'] + "')"
                    else:
                        mfgAreaNameString = mfgAreaNameString + "(MFG_AREA_NAME='" + selectedMfgAreaName[index]['value'] + "') or "
                keywordSummary.append(mfgAreaNameString)

            if(len(selectedProductFamily)!=0):
                for index in range(len(selectedProductFamily)):
                    if(index == len(selectedProductFamily) - 1):
                        productFamilyString = productFamilyString + "(PRODUCT_FAMILY='" + selectedProductFamily[index]['value'] + "')"
                    else:
                        productFamilyString = productFamilyString + "(PRODUCT_FAMILY='" + selectedProductFamily[index]['value'] + "') or "
                keywordSummary.append(productFamilyString)
            
            if(len(selectedProduct)!=0):
                for index in range(len(selectedProduct)):
                    if(index == len(selectedProduct) - 1):
                        productString = productString + "(PRODUCT='" + selectedProduct[index]['value'] + "')"
                    else:
                        productString = productString + "(PRODUCT='" + selectedProduct[index]['value'] + "') or "
                keywordSummary.append(productString)
            
            for index in range(len(keywordSummary)):
                if(len(keywordSummary[index])==0):
                    continue
                else:
                    if index == len(keywordSummary) -1:
                        keywordSummaryString = keywordSummaryString + keywordSummary[index]
                    else:
                        keywordSummaryString = keywordSummaryString + keywordSummary[index] + " and "

            if len(keywordSummaryString)!=0:
                keywordSummaryString = keywordSummaryString + " and DATA_TYPE = 'WIP'"
            else:
                keywordSummaryString = keywordSummaryString + " DATA_TYPE = 'WIP'"

            sqlSelectedDataTypeOperationsMenuList = sqlSelectedDataTypeOperationsMenuList + keywordSummaryString + " order by OPERATION"

            #print(sqlSelectedDataTypeOperationsMenuList)
    else:
        dataSummary = {}
        dataSummary["title"] = "not_developed"
        return JsonResponse(dataSummary, safe=False) 


    dbInstance_1, dbConnection_1 = connectDatabase()
    dbInstance_2, dbConnection_2 = connectDatabase()

    try:
        if(selectedDataTypeClicked != "WIP"):
            dbInstance_1.execute(sqlSelectedDataTypeOperationsMenuList)
            selectedDataTypeOperationsMenuList = dbInstance_1.fetchall()
            dbInstance_1.execute("COMMIT")
            
            dbInstance_2.execute(sqlSelectedDataTypeParameters)
            selectedDataTypeParameters = dbInstance_2.fetchall()
            dbInstance_2.execute("COMMIT")
        else:
            dbInstance_1.execute(sqlSelectedDataTypeOperationsMenuList)
            selectedDataTypeOperationsMenuList = dbInstance_1.fetchall()
            dbInstance_1.execute("COMMIT")
    except Exception as e:
        print('Connection or execution failed:', e)
    finally:
        dbInstance_1.close()
        dbConnection_1.close()
        dbInstance_2.close()
        dbConnection_2.close()
    
    #print(selectedDataTypeOperationsMenuList)
    #print(selectedDataTypeParameters)

    dataSummary = {}
    operationMenuList = []
    dataTypeParameters = []

    if(selectedDataTypeClicked != "WIP"):
        dict = {}
        dict['value'] = "All"
        dict['label'] = "All"
        operationMenuList.append(dict)

    for index in range(len(selectedDataTypeOperationsMenuList)):
        dict = {}
        dict['value'] = selectedDataTypeOperationsMenuList[index][0]
        dict['label'] = selectedDataTypeOperationsMenuList[index][0]
        operationMenuList.append(dict)

    if(selectedDataTypeClicked != "WIP"):
        for index in range(len(selectedDataTypeParameters)):
            dict = {}
            dict['value'] = selectedDataTypeParameters[index][0]
            dict['label'] = selectedDataTypeParameters[index][0]
            dataTypeParameters.append(dict)
    
    dataSummary["title"] = title
    dataSummary["operationMenuList"] = operationMenuList
    
    if(selectedDataTypeClicked != "WIP"):
        dataSummary["dataTypeParameters"] = dataTypeParameters

    print(dataSummary)
    
    return JsonResponse(dataSummary, safe=False)

@csrf_exempt
def ParametersSummaryForJson(request):
    TECHNOLOGY = json.loads(request.GET.get('TECHNOLOGY'))
    MFG_AREA_NAME = json.loads(request.GET.get('MFG_AREA_NAME'))
    DATA_TYPE = json.loads(request.GET.get('DATA_TYPE'))
    PRODUCT_FAMILY = json.loads(request.GET.get('PRODUCT_FAMILY'))
    PRODUCT = json.loads(request.GET.get('PRODUCT'))
    LOT_TYPE = json.loads(request.GET.get('LOT_TYPE'))
    PROJECT = json.loads(request.GET.get('PROJECT'))
    MCN = json.loads(request.GET.get('MCN'))
    PRODUCT_MASK_SET = json.loads(request.GET.get('PRODUCT_MASK_SET'))
    PRODUCT_ID = json.loads(request.GET.get('PRODUCT_ID'))
    PROCESS_AREA = json.loads(request.GET.get('PROCESS_AREA'))
    OPERATION = json.loads(request.GET.get('OPERATION'))
    SUB_OPERATION = json.loads(request.GET.get('SUB_OPERATION'))
    EQUIP = json.loads(request.GET.get('EQUIP'))
    CALENDAR_OPTION = json.loads(request.GET.get('CALENDAR_OPTION'))
    CALENDAR_OPTION_DATE = json.loads(request.GET.get('CALENDAR_OPTION_DATE'))
    CALENDAR_OPTION_LAST_N_DAYS_LOTS = json.loads(request.GET.get('CALENDAR_OPTION_LAST_N_DAYS_LOTS'))
    CALENDAR_OPTION_CALENDAR_RULE = json.loads(request.GET.get('CALENDAR_OPTION_CALENDAR_RULE'))
    DATA_RETRIEVAL_AGGREGATION_LEVEL = json.loads(request.GET.get('DATA_RETRIEVAL_AGGREGATION_LEVEL'))
    DATA_RETRIEVAL_RETRIEVE_PARAMETER_BY = json.loads(request.GET.get('DATA_RETRIEVAL_RETRIEVE_PARAMETER_BY'))
    DATA_RETRIEVAL_TYPES = json.loads(request.GET.get('DATA_RETRIEVAL_TYPES'))
    DATA_RETRIEVAL_WP_OPERATION_MENU_LIST_SELECTED_VALUE = json.loads(request.GET.get('DATA_RETRIEVAL_WP_OPERATION_MENU_LIST_SELECTED_VALUE'))
    DATA_RETRIEVAL_PCM_OPERATION_MENU_LIST_SELECTED_VALUE = json.loads(request.GET.get('DATA_RETRIEVAL_PCM_OPERATION_MENU_LIST_SELECTED_VALUE'))
    DATA_RETRIEVAL_USE_SUB_OPERATIONS = json.loads(request.GET.get('DATA_RETRIEVAL_USE_SUB_OPERATIONS'))
    PARAMETER_CONTAINER_WIP_SELECTED_VALUE = json.loads(request.GET.get('PARAMETER_CONTAINER_WIP_SELECTED_VALUE'))
    PARAMETER_CONTAINER_WP_SELECTED_VALUE = json.loads(request.GET.get('PARAMETER_CONTAINER_WP_SELECTED_VALUE'))
    PARAMETER_CONTAINER_PCM_SELECTED_VALUE = json.loads(request.GET.get('PARAMETER_CONTAINER_PCM_SELECTED_VALUE'))


    # this is for PCM case
    PCMRequestColumnsForLot = [
        {
            "field" : {
                "name" : "MEAN",
                "type" : "float"
            },
            "collisionFlag" : "last"
        },
        {
            "field" : {
                "name" : "MEAS_DATE",
                "type" : "date"
            },
            "collisionFlag" : "last"
        },
        {
            "field" : {
                "name" : "STDDEV",
                "type" : "float"
            },
            "collisionFlag" : "last"
        },
        {
            "field" : {
                "name" : "MEDIAN",
                "type" : "float"
            },
            "collisionFlag" : "last"
        }
    ]

    PCMRequestColumnsForUnit = [
        {
            "field" : {
                "name" : "RESULT",
                "type" : "float"
            },
            "collisionFlag" : "any"
        },
        {
            "field" : {
                "name" : "SITE",
                "type" : "string"
            },
            "collisionFlag" : "any"
        }
    ]

    PCMRequestColumnsForWafer = [
        {
            "field" : {
                "name" : "MEAN",
                "type" : "float"
            },
            "collisionFlag" : "any"
        },
        {
            "field" : {
                "name" : "MEDIAN",
                "type" : "float"
            },
            "collisionFlag" : "any"
        }
    ]

    PCMParameter = {
        "dataType" : "ETEST",
        "filterGroups" : [
            [
               {
                    "field" : {
                        "name" : "OPERATION",
                        "type" : "string"
                    },
                    "operation" : "=",
                    "value" : []       # need to fill
               },
               {
                    "field" : {
                        "name" : "PARAMETER",
                        "type" : "string"
                    },
                    "operation" : "",   # need to fill
                    "value" : []     # need to fill
               }
            ]
        ],
        "extraFilterGroups" : [ [] ],
        "requestColumns" : []     # need to fill
    }

    # this is for WP case
    WPRequestColumnsForUnit = [
        {
            "field" : {
                "name" : "RESULT",
                "type" : "float"
            },
            "collisionFlag" : "last"
        },
        {
            "field" : {
                "name" : "START_DATE",
                "type" : "date"
            },
            "collisionFlag" : "last"
        }
    ]

    WPRequestColumnsForWafer = [
        {
            "field" : {
                "name" : "MEAN",
                "type" : "float"
            },
            "collisionFlag" : "last"
        },
        {
            "field" : {
                "name" : "START_DATE",
                "type" : "date"
            },
            "collisionFlag" : "last"
        },
        {
            "field" : {
                "name" : "MEDIAN",
                "type" : "float"
            },
            "collisionFlag" : "last"
        }
    ]

    WPParameter = {
        "dataType" : "SORT_PARAM",
        "filterGroups" : [
            [
               {
                    "field" : {
                        "name" : "OPERATION",
                        "type" : "string"
                    },
                    "operation" : "=",
                    "value" : []       # need to fill
               },
               {
                    "field" : {
                        "name" : "PARAMETER",
                        "type" : "string"
                    },
                    "operation" : "",   # need to fill
                    "value" : []     # need to fill
               }
            ]
        ],
        "extraFilterGroups" : [ [] ],
        "requestColumns" : []     # need to fill
    }

    # this is for WIP case
   
    WIPParameter = {
        "dataType" : "WIP",
        "filterGroups" : [],
        "extraFilterGroups" : [ [] ],
        "requestColumns" : [ # need to fill
            {
               "field" : {
                  "name" : "EQUIP",
                  "type" : "string"
               },
               "collisionFlag" : "any"
            },
            {
               "field" : {
                  "name" : "HIST_START_DATE",
                  "type" : "date"
               },
               "collisionFlag" : "any"
            }
        ]     
    }

    # summary of parameter
    parameter = []
    for index in range(len(DATA_RETRIEVAL_TYPES)):
        if (DATA_RETRIEVAL_TYPES[index] == "PCM"):
            PCMParameter["filterGroups"][0][0]["value"].append(DATA_RETRIEVAL_PCM_OPERATION_MENU_LIST_SELECTED_VALUE) 

            if (len(PARAMETER_CONTAINER_PCM_SELECTED_VALUE) == 1):
                PCMParameter["filterGroups"][0][1]["operation"] = "="
            else:
                PCMParameter["filterGroups"][0][1]["operation"] = "in"

            PCMParameter["filterGroups"][0][1]["value"] = PARAMETER_CONTAINER_PCM_SELECTED_VALUE

            if (DATA_RETRIEVAL_AGGREGATION_LEVEL == "Lot"):
                PCMParameter["requestColumns"] = PCMRequestColumnsForLot
            if (DATA_RETRIEVAL_AGGREGATION_LEVEL == "Wafer"):
                PCMParameter["requestColumns"] = PCMRequestColumnsForWafer
            if (DATA_RETRIEVAL_AGGREGATION_LEVEL == "Unit"):
                PCMParameter["requestColumns"] = PCMRequestColumnsForUnit 

            parameter.append(PCMParameter)
        
        if (DATA_RETRIEVAL_TYPES[index] == "WP"):
            WPParameter["filterGroups"][0][0]["value"].append(DATA_RETRIEVAL_WP_OPERATION_MENU_LIST_SELECTED_VALUE) 

            if (len(PARAMETER_CONTAINER_WP_SELECTED_VALUE) == 1):
                WPParameter["filterGroups"][0][1]["operation"] = "="
            else:
                WPParameter["filterGroups"][0][1]["operation"] = "in"

            WPParameter["filterGroups"][0][1]["value"] = PARAMETER_CONTAINER_WP_SELECTED_VALUE

            if (DATA_RETRIEVAL_AGGREGATION_LEVEL == "Wafer"):
                WPParameter["requestColumns"] = WPRequestColumnsForWafer
            if (DATA_RETRIEVAL_AGGREGATION_LEVEL == "Unit"):
                WPParameter["requestColumns"] = WPRequestColumnsForUnit 

            parameter.append(WPParameter)

        if (DATA_RETRIEVAL_TYPES[index] == "WIP"):
            WIPFilterGroup = []

            for index in range(len(PARAMETER_CONTAINER_WIP_SELECTED_VALUE)):
                filterGroupTempArray = [
                    {
                        "field" : {
                            "name" : "OPERATION",
                            "type" : "string"
                        },
                        "operation" : "=",
                        "value" : []
                    }
                ]
                filterGroupTempArray[0]["value"].append(PARAMETER_CONTAINER_WIP_SELECTED_VALUE[index])
                WIPFilterGroup.append(filterGroupTempArray)

            WPParameter["filterGroups"] = WIPFilterGroup

            parameter.append(WPParameter)


    #print("this is parameter: " + str(parameter))

    JsonFile = {
        "header" : {
            "version" : "3.6",
            "module" : "GenesisDataRetrieval",
            "moduleDescription" : "",
            "createDate" : "11/17/2021 05:08:45 PM",
            "modifyDate" : "11/17/2021 05:08:45 PM"
        },
        "global" : {
            "environment" : "10.85.10.61/dms",
            "dsName" : "PCM.mdf11",     
            "dsFormat" : "gds",
            "dsLimitSheetFormat" : "xml",
            "logExtension" : "SG",
            "dataRetrievalMode" : "all",
            "limitSetNameRule" : "$Product$",
            "zeroColumnPattern" : [ "HBIN%_BIN_QTY", "SBIN%_BIN_QTY" ],
            "genesisMessage" : "WM_OpenGDS",
            "setDefectFile" : True,
            "useShortParamName" : False,
            "useGroupName" : False,
            "retrieveGenealogyData" : False,
            "matchedOnly" : True,
            "guiType" : 1,
            "ybgbmergetype" : "first",
            "retainGenealogyKey" : True,
            "expandLot" : False,
            "sortDataByStartDate" : False,
            "groupedParameter" : True,
            "showLimitOptionsTab" : True,
            "isArtistFdcTrace" : False,
            "useCalendarQuery" : False
        },
        "descriptor" : {
            "rows" : [
                {
                    "name" : "Lot",
                    "type" : "string"
                },
                {
                    "name" : "Wafer",
                    "type" : "string"
                },
                {
                    "name" : "AU_ID",
                    "type" : "integer"
                },
                {
                    "name" : "AU_TYPE",
                    "type" : "string"
                },
                {
                    "name" : "BLADE",
                    "type" : "string"
                },
                {
                    "name" : "BLADE_ID",
                    "type" : "string"
                },
                {
                    "name" : "CUT_DIRECTION",
                    "type" : "string"
                },
                {
                    "name" : "CUT_LINE_ID",
                    "type" : "string"
                },
                {
                    "name" : "CUT_LINE_NUM",
                    "type" : "integer"
                },
                {
                    "name" : "CUT_ORDER",
                    "type" : "integer"
                },
                {
                    "name" : "CUT_POS",
                    "type" : "integer"
                },
                {
                    "name" : "CUT_THETA",
                    "type" : "integer"
                },
                {
                    "name" : "END_XPOS",
                    "type" : "integer"
                },
                {
                    "name" : "MACHINE_ID",
                    "type" : "integer"
                },
                {
                    "name" : "MACHINE_NAME",
                    "type" : "string"
                },
                {
                    "name" : "Product",
                    "type" : "string"
                },
                {
                    "name" : "Product_Family",
                    "type" : "string"
                },
                {
                    "name" : "START_XPOS",
                    "type" : "integer"
                }
            ],
            "columns" : [
                {
                    "name" : "Data_Type",
                    "type" : "string"
                },
                {
                    "name" : "Mfg_Area_Name",
                    "type" : "string"
                },
                {
                    "name" : "RECIPE_NUM_PARAM_1",
                    "type" : "integer"
                },
                {
                    "name" : "Operation",
                    "type" : "string"
                },
                {
                    "name" : "SEQUENCE",
                    "type" : "integer"
                },
                {
                    "name" : "Original_Data_Type",
                    "type" : "string"
                },
                {
                    "name" : "TEST_DESC",
                    "type" : "string"
                },
                {
                    "name" : "Parameter",
                    "type" : "string"
                },
                {
                    "name" : "Pattern_Name",
                    "type" : "string"
                },
                {
                    "name" : "Process_Area",
                    "type" : "string"
                },
                {
                    "name" : "Process_Step",
                    "type" : "string"
                },
                {
                    "name" : "Product_Family",
                    "type" : "string"
                },
                {
                    "name" : "Production_Area",
                    "type" : "string"
                },
                {
                    "name" : "PROJECT",
                    "type" : "string"
                },
                {
                    "name" : "RECIPE_ID",
                    "type" : "string"
                },
                {
                    "name" : "ROI",
                    "type" : "string"
                },
                {
                    "name" : "Route",
                    "type" : "string"
                },
                {
                    "name" : "Sub_Operation",
                    "type" : "string"
                },
                {
                    "name" : "Technology",
                    "type" : "string"
                },
                {
                    "name" : "Test_Prog",
                    "type" : "string"
                }
            ]
        },
        "lotWafer" : {
            "filterGroup" : [
                [
                    {
                    "field" : {
                        "name" : "LOT",
                        "type" : "string"
                    },
                    "operation" : "in",
                    "value" : [ "RTEC-2000707!2293", "RTEC-2000707!2294", "RTEC-2000707!2295" ]
                    }
                ]
            ],
            "dynamicList" : False
        },
        "parameters" : [],
        "wizard" : {
            "getData" : "lot",
            "showRefreshDate" : True,
            "showGetLotByParam" : False,
            "showToggleOperators" : True,
            "useLogicalOperators" : True,
            "showWafers" : True,
            "showGetDataBy" : True,
            "showReqCols" : True,
            "showPostQuery" : True,
            "hierarchy" : [
                "TECHNOLOGY",
                "MFG_AREA_NAME",
                "PRODUCT_FAMILY",
                "PRODUCT",
                "LOT_TYPE",
                "PROJECT",
                "MCN",
                "PRODUCT_MASK_SET",
                "PART_ID",
                "DATA_TYPE",
                "PROCESS_AREA",
                "OPERATION",
                "SUB_OPERATION",
                "EQUIP"
            ],
            "hierarchy_sel" : [
                "TECHNOLOGY",
                "MFG_AREA_NAME",
                "PRODUCT_FAMILY",
                "PRODUCT",
                "LOT_TYPE",
                "PROJECT",
                "MCN",
                "PRODUCT_MASK_SET",
                "PART_ID",
                "DATA_TYPE",
                "PROCESS_AREA",
                "OPERATION",
                "SUB_OPERATION",
                "EQUIP"
            ]
        },
        "hierarchyList" : {
            "filters" : [
                {
                    "field" : {
                    "name" : "DATA_TYPE",
                    "type" : "string"
                    },
                    "operation" : "=",
                    "value" : [ "ETEST" ]
                },
                {
                    "field" : {
                    "name" : "DATE_STEP_STARTED",
                    "type" : "date"
                    },
                    "operation" : "between",
                    "value" : [ "11/10/2018 05:06:55 PM", "11/17/2021 05:06:55 PM" ]
                }
            ]
        },
        "timeProductLimit" : {
            "keepLatestLimit" : False,
            "limitColumns" : []
        }
    }

    JsonFile["parameters"] = parameter

    print("this is JsonFile: " + str(JsonFile))

    with open("../inquery.json","w") as f:
        json.dump(JsonFile,f)
        print("json file writes successfully!")

    return JsonResponse("JSON file created successfully!", safe=False)





